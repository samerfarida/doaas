/* global module, process, Buffer */

module.exports = async ({ github, context, core }) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const pr = context.payload.pull_request;

  const CHUNK_SIZE = 50; // how many strings per moderation request
  const MAX_RETRIES = 4; // total attempts per request
  const BASE_DELAY_MS = 500; // initial backoff (non-429)
  const MAX_DELAY_MS = 8000; // cap backoff (non-429)
  const BASE_DELAY_429_MS = 5000; // initial backoff for 429 Too Many Requests
  const MAX_DELAY_429_MS = 60000; // cap backoff for 429 (allow up to 1 min wait)
  const DELAY_BETWEEN_CHUNKS_MS = 2000; // delay between API chunk requests (spread load)
  const MAX_NEW_STRINGS = 500; // hard cap to prevent abuse / oversized payloads

  const COMMENT_TRUNCATE_CHARS = 220; // truncate displayed text in PR comment
  const COMMENT_MAX_SCORE_ROWS = 50; // limit score rows (defense-in-depth for weird responses)

  if (!process.env.OPENAI_API_KEY) {
    core.setFailed("Missing OPENAI_API_KEY secret.");
    return;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const decodeContent = (content, encoding) => {
    if (!content) return "";
    if (encoding === "base64") return Buffer.from(content, "base64").toString("utf8");
    return content;
  };

  const collectStrings = (value, out) => {
    if (typeof value === "string") out.add(value);
    else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
    else if (value && typeof value === "object")
      Object.values(value).forEach((v) => collectStrings(v, out));
  };

  const chunkArray = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const escapeBackticks = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`");

  const truncateForComment = (s) => {
    const str = String(s);
    if (str.length <= COMMENT_TRUNCATE_CHARS) return str;
    return str.slice(0, COMMENT_TRUNCATE_CHARS) + "… (truncated)";
  };

  async function getFooter(isFail) {
    const url = isFail
      ? "https://doaas.dev/no?mode=security&format=text"
      : "https://doaas.dev/lgtm?mode=devops&format=text";

    try {
      const r = await fetch(url, { headers: { "User-Agent": "github-action" } });
      if (!r.ok) throw new Error(`DOAAS HTTP ${r.status}`);
      const text = (await r.text()).trim();

      if (text) return `— ${text}\n\nPowered by OpenAI Moderation & DevOps as a Service`;
      return "Powered by OpenAI Moderation & DevOps as a Service";
    } catch {
      return "Powered by OpenAI Moderation & DevOps as a Service";
    }
  }

  async function commentPr(body) {
    const botLogin = "github-actions[bot]";
    const marker = "Moderation PASS (strict)";
    const markerFail = "Moderation FAIL (strict)";

    const { data: comments } = await github.rest.issues.listComments({
      owner,
      repo,
      issue_number: pr.number,
      per_page: 100,
    });

    const existing = comments
      .filter(
        (c) =>
          c.user?.login === botLogin && (c.body?.includes(marker) || c.body?.includes(markerFail))
      )
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

    if (existing) {
      await github.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existing.id,
        body,
      });
    } else {
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body,
      });
    }
  }

  function isRetryableStatus(status) {
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
  }

  function sanitizeErrorForPr(err) {
    // Keep PR-visible info short and non-leaky
    const status = err?.status ? `HTTP ${err.status}` : "Error";
    const msg = String(err?.message || err || "").slice(0, 300);
    return `${status}: ${msg}`;
  }

  async function fetchWithRetry(url, options) {
    let lastErr;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(url, options);

        if (res.ok) return res;

        const bodyText = await res.text().catch(() => "");
        const err = new Error(`HTTP ${res.status}: ${bodyText}`);
        err.status = res.status;

        if (!isRetryableStatus(res.status) || attempt === MAX_RETRIES) {
          throw err;
        }

        let delayMs;
        if (res.status === 429) {
          const retryAfterSec = res.headers.get("Retry-After");
          if (retryAfterSec != null) {
            const sec = parseInt(retryAfterSec, 10);
            if (Number.isFinite(sec)) {
              delayMs = Math.min(sec * 1000, MAX_DELAY_429_MS);
            } else {
              delayMs = Math.min(MAX_DELAY_429_MS, BASE_DELAY_429_MS * Math.pow(2, attempt - 1));
            }
          } else {
            delayMs = Math.min(MAX_DELAY_429_MS, BASE_DELAY_429_MS * Math.pow(2, attempt - 1));
          }
        } else {
          delayMs = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * Math.pow(2, attempt - 1));
        }
        const jitter = Math.floor(Math.random() * 500);
        const delay = delayMs + jitter;

        core.warning(
          `Retryable error (attempt ${attempt}/${MAX_RETRIES}) ${url}: ${err.message}. Waiting ${Math.round(delay / 1000)}s before retry.`
        );
        await sleep(delay);
        lastErr = err;
      } catch (e) {
        // Network errors: retry
        lastErr = e;
        const status = e?.status;
        const retryable = status ? isRetryableStatus(status) : true;

        if (!retryable || attempt === MAX_RETRIES) throw e;

        const delayMs =
          status === 429
            ? Math.min(MAX_DELAY_429_MS, BASE_DELAY_429_MS * Math.pow(2, attempt - 1))
            : Math.min(MAX_DELAY_MS, BASE_DELAY_MS * Math.pow(2, attempt - 1));
        const jitter = Math.floor(Math.random() * 500);
        const delay = delayMs + jitter;

        core.warning(
          `Retrying after error (attempt ${attempt}/${MAX_RETRIES}): ${String(e.message || e)}. Waiting ${Math.round(delay / 1000)}s.`
        );
        await sleep(delay);
      }
    }

    throw lastErr || new Error("Unknown fetchWithRetry failure");
  }

  async function moderateBatch(texts) {
    const res = await fetchWithRetry("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: texts,
      }),
    });

    return res.json();
  }

  // 1) List files in PR
  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: pr.number,
    per_page: 100,
  });

  const endpointFiles = files
    .map((f) => f.filename)
    .filter((name) => name.startsWith("endpoints/") && name.endsWith(".json"));

  // 2) Build newlyAdded list by comparing base vs head
  const newlyAdded = [];
  const fileCounts = new Map();

  if (endpointFiles.length > 0) {
    for (const path of endpointFiles) {
      // Head (PR)
      const headResp = await github.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: pr.head.sha,
      });
      const headText = decodeContent(headResp.data.content, headResp.data.encoding);

      // Base (target branch) — may not exist if file is new
      let baseText = "";
      try {
        const baseResp = await github.rest.repos.getContent({
          owner,
          repo,
          path,
          ref: pr.base.sha,
        });
        baseText = decodeContent(baseResp.data.content, baseResp.data.encoding);
      } catch {
        baseText = "";
      }

      let headJson = null;
      let baseJson = null;

      try {
        headJson = JSON.parse(headText);
      } catch (err) {
        core.warning(`Failed to parse head JSON for ${path}: ${String(err?.message || err)}`);
      }
      try {
        baseJson = baseText ? JSON.parse(baseText) : null;
      } catch (err) {
        core.warning(`Failed to parse base JSON for ${path}: ${String(err?.message || err)}`);
      }

      if (!headJson) {
        newlyAdded.push({ file: path, text: "[Invalid JSON: unable to parse file]" });
        fileCounts.set(path, (fileCounts.get(path) || 0) + 1);
        continue;
      }

      const headSet = new Set();
      const baseSet = new Set();

      collectStrings(headJson, headSet);
      if (baseJson) collectStrings(baseJson, baseSet);

      for (const s of headSet) {
        if (!baseSet.has(s) && String(s).trim() !== "") {
          newlyAdded.push({ file: path, text: s });
          fileCounts.set(path, (fileCounts.get(path) || 0) + 1);
        }
      }
    }
  }

  // Scanned files section (always present for consistency)
  const scannedFilesLines = endpointFiles.length
    ? endpointFiles.map((f) => `- \`${f}\` (${fileCounts.get(f) || 0} new strings)`)
    : ["_None_"];

  // If nothing to moderate, PASS comment
  if (endpointFiles.length === 0 || newlyAdded.length === 0) {
    const footer = await getFooter(false);
    const body = [
      "✅ **Moderation PASS (strict)**",
      `Checked **${newlyAdded.length}** newly-added string(s) across **${endpointFiles.length} file(s)**.`,
      "",
      "### Scanned files",
      ...scannedFilesLines,
      "",
      footer,
    ].join("\n");

    await commentPr(body);
    return;
  }

  // Hard cap to avoid abuse / payload blowups
  if (newlyAdded.length > MAX_NEW_STRINGS) {
    const footer = await getFooter(true);
    const body = [
      "❌ **Moderation FAIL (strict)** — Too many newly-added strings in one PR.",
      `Found **${newlyAdded.length}** newly-added string(s), max allowed is **${MAX_NEW_STRINGS}**.`,
      "",
      "### Scanned files",
      ...scannedFilesLines,
      "",
      "Split this PR into smaller chunks and retry.",
      "",
      footer,
    ].join("\n");

    await commentPr(body);
    core.setFailed(
      `Too many newly-added strings (${newlyAdded.length}); limit is ${MAX_NEW_STRINGS}.`
    );
    return;
  }

  // 3) Separate invalid-json markers from real text
  const invalidJsonItems = newlyAdded.filter((x) => String(x.text).startsWith("[Invalid JSON"));
  const realItems = newlyAdded.filter((x) => !String(x.text).startsWith("[Invalid JSON"));

  // 4) Moderate real items in batches
  const failures = [];
  const passes = [];

  // invalid JSON is an automatic failure
  for (const bad of invalidJsonItems) {
    failures.push({
      file: bad.file,
      text: bad.text,
      categoriesTrue: ["invalid_json"],
      scores: {},
    });
  }

  const realTexts = realItems.map((x) => x.text);
  const chunks = chunkArray(realTexts, CHUNK_SIZE);

  try {
    let offset = 0;
    for (const [chunkIndex, chunk] of chunks.entries()) {
      if (chunkIndex > 0) {
        const gap = DELAY_BETWEEN_CHUNKS_MS + Math.floor(Math.random() * 500);
        await sleep(gap);
      }
      const result = await moderateBatch(chunk);
      const resultsArr = result?.results || [];

      if (resultsArr.length !== chunk.length) {
        throw new Error(
          `Moderation response length mismatch: sent ${chunk.length}, got ${resultsArr.length}`
        );
      }

      for (let i = 0; i < resultsArr.length; i++) {
        const r = resultsArr.at(i);
        const item = realItems.at(offset + i);

        const flagged = !!r?.flagged;
        const categories = r?.categories || {};
        const scores = r?.category_scores || {};

        if (!flagged) {
          passes.push(item);
          continue;
        }

        const categoriesTrue = Object.entries(categories)
          .filter(([_, v]) => v === true)
          .map(([k]) => k);

        const trueSet = new Set(categoriesTrue);
        const filteredScores = Object.fromEntries(
          Object.entries(scores).filter(([k, v]) => trueSet.has(k) && typeof v === "number")
        );

        failures.push({
          file: item.file,
          text: item.text,
          categoriesTrue,
          scores: filteredScores,
        });
      }

      offset += chunk.length;
    }
  } catch (err) {
    // Full details in logs
    core.error(err);

    // Sanitized error in PR comment
    const footer = await getFooter(true);
    const body = [
      "❌ **Moderation ERROR** — The moderation API call failed, so this check is failing safe.",
      "",
      "### Scanned files",
      ...scannedFilesLines,
      "",
      "### Error details",
      `\`${escapeBackticks(sanitizeErrorForPr(err))}\``,
      "",
      footer,
    ].join("\n");

    await commentPr(body);
    core.setFailed("Moderation error: API call failed.");
    return;
  }

  // 5) Build consistent PR comment (PASS or FAIL)
  const lines = [];

  if (failures.length === 0) {
    lines.push("✅ **Moderation PASS (strict)**");
    lines.push(
      `Checked **${newlyAdded.length}** newly-added string(s) across **${endpointFiles.length} file(s)**.`
    );
    lines.push("");
    lines.push("### Scanned files");
    lines.push(...scannedFilesLines);
  } else {
    lines.push(
      `❌ **Moderation FAIL (strict)** — **${failures.length}/${newlyAdded.length}** newly-added string(s) flagged across **${endpointFiles.length} file(s)**.`
    );
    lines.push("");
    lines.push("### Scanned files");
    lines.push(...scannedFilesLines);
    lines.push("");
    lines.push("### Flagged items");

    for (const f of failures) {
      const shownText = truncateForComment(f.text);

      lines.push(`**File:** \`${f.file}\``);
      lines.push(`**Text:** \`${escapeBackticks(shownText)}\``);
      lines.push(
        `**Categories:** ${f.categoriesTrue.length ? f.categoriesTrue.join(", ") : "(none reported)"}`
      );
      lines.push("");

      const scoreEntries = Object.entries(f.scores || {}).slice(0, COMMENT_MAX_SCORE_ROWS);

      if (scoreEntries.length) {
        lines.push("| Category | Score |");
        lines.push("|---|---:|");
        for (const [cat, score] of scoreEntries) {
          lines.push(`| \`${cat}\` | \`${Number(score).toFixed(6)}\` |`);
        }
        if (Object.keys(f.scores || {}).length > scoreEntries.length) {
          lines.push(`| _...more_ | _truncated_ |`);
        }
      } else {
        lines.push("_No category_scores available for the triggered categories._");
      }

      lines.push("\n---\n");
    }
  }

  // Footer from DOAAS
  lines.push("");
  lines.push(await getFooter(failures.length > 0));

  // Post or update PR comment (single comment per PR, updated on each run)
  await commentPr(lines.join("\n"));

  // Fail job if any flagged content detected
  if (failures.length > 0) {
    core.setFailed("Moderation failed (strict): flagged content detected.");
  }
};
