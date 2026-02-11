/**
 * End-to-end tests: run against a real HTTP server.
 * - In CI (or E2E_FAST=1): starts a fast Node HTTP server that uses the built handleRequest (no wrangler).
 * - Otherwise: spawns wrangler dev, waits for it, then runs the same tests.
 *
 * Usage:
 *   npm run test:e2e                    — build, start server (fast in CI, wrangler locally), run E2E
 *   BASE=http://localhost:8787 node tests/e2e.mjs  — use existing server
 *   E2E_FAST=1 node tests/e2e.mjs       — use fast Node server (requires prior npm run build)
 */

import assert from "assert";
import { createServer } from "http";
import { spawn } from "child_process";

const BASE = process.env.BASE || "http://localhost:8787";
const START_SERVER = !process.env.BASE;
const USE_FAST_SERVER = !!(process.env.CI || process.env.E2E_FAST);
const PORT = 8787;
const READY_TIMEOUT_MS = 30_000;
const POLL_MS = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer() {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await sleep(POLL_MS);
  }
  throw new Error(`Server at ${BASE} did not become ready within ${READY_TIMEOUT_MS}ms`);
}

async function testRoot() {
  const res = await fetch(`${BASE}/`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.service, "DOaaS");
  assert(Array.isArray(json.endpoints));
  assert(json.endpoints.length > 0);
  assert(json.endpoints[0].name);
  assert(json.endpoints[0].description);
  assert(json.endpoints[0].path);
  assert(json.usage?.examples?.length > 0);
}

async function testHelp() {
  const res = await fetch(`${BASE}/help`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.service, "DOaaS");
  assert(Array.isArray(json.endpoints));
}

async function testRootFormatText() {
  const res = await fetch(`${BASE}/?format=text`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert(text.includes("DOaaS Endpoints"));
  assert(text.includes("Available endpoints"));
}

async function testRandom() {
  const res = await fetch(`${BASE}/random?format=text`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert(text.length > 0);
}

async function testKnownEndpointJson(endpointName) {
  const res = await fetch(`${BASE}/${endpointName}?format=json`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.name, endpointName);
}

async function testUnknownEndpoint() {
  const res = await fetch(`${BASE}/unknown`);
  assert.strictEqual(res.status, 404);
  const json = await res.json();
  assert.strictEqual(json.error, "Endpoint not found");
}

async function testOptionsCors() {
  const res = await fetch(`${BASE}/blame`, { method: "OPTIONS" });
  assert.strictEqual(res.status, 204);
  assert.strictEqual(res.headers.get("Access-Control-Allow-Origin"), "*");
  assert.strictEqual(res.headers.get("Access-Control-Allow-Methods"), "GET, OPTIONS");
}

async function testBlameModeSpecific() {
  const res = await fetch(`${BASE}/blame?mode=toxic&format=json`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.name, "blame");
  assert.strictEqual(json.mode, "toxic");
  assert(typeof json.example === "string" && json.example.length > 0);
}

async function testRandomWithMode() {
  const res = await fetch(`${BASE}/random?mode=toxic&format=json`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.mode, "toxic");
  assert(["blame", "motivate"].includes(json.name));
  assert(typeof json.example === "string" && json.example.length > 0);
}

async function testRandomWithUnsupportedMode() {
  const res = await fetch(`${BASE}/random?mode=nonexistent`);
  assert.strictEqual(res.status, 404);
  const json = await res.json();
  assert.strictEqual(json.error, "No endpoint supports the requested mode");
  assert.strictEqual(json.requestedMode, "nonexistent");
  assert(Array.isArray(json.supportedModes) && json.supportedModes.length > 0);
}

async function testAllEndpointsJsonE2E(rootJson) {
  const endpoints = Array.isArray(rootJson.endpoints) ? rootJson.endpoints : [];
  for (const ep of endpoints) {
    const name = ep?.name;
    if (!name || name === "random") continue;
    const res = await fetch(`${BASE}/${name}?format=json`);
    assert.strictEqual(res.status, 200, `expected 200 for /${name}, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.name, name);
    assert(typeof json.example === "string" && json.example.length > 0);
  }
}

async function testCorsOnGetE2E() {
  const res = await fetch(`${BASE}/`);
  assert.strictEqual(res.headers.get("Access-Control-Allow-Origin"), "*");
  assert.strictEqual(res.headers.get("Cache-Control"), "no-store");
}

async function runTests() {
  const rootRes = await fetch(`${BASE}/`);
  assert(rootRes.ok, "need root to get endpoint list");
  const rootJson = await rootRes.json();
  const firstEndpointName = rootJson.endpoints?.[0]?.name;
  assert(firstEndpointName, "endpoints list should have at least one name");

  await testRoot();
  await testHelp();
  await testRootFormatText();
  await testRandom();
  await testKnownEndpointJson(firstEndpointName);
  await testUnknownEndpoint();
  await testBlameModeSpecific();
  await testRandomWithMode();
  await testRandomWithUnsupportedMode();
  await testAllEndpointsJsonE2E(rootJson);
  await testCorsOnGetE2E();
  await testOptionsCors();
  console.log("All E2E tests passed.");
}

function spawnWrangler() {
  const child = spawn("npx", ["wrangler", "dev", "--port", String(PORT)], {
    cwd: new URL("..", import.meta.url).pathname,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  child.on("error", (err) => {
    console.error("Failed to start wrangler dev:", err);
    process.exit(1);
  });

  return child;
}

/** In-process HTTP server using built handleRequest; used in CI for fast E2E. */
async function startFastHttpServer() {
  const { TextDecoder } = await import("util");
  global.TextDecoder = TextDecoder;
  const { handleRequest } = await import("../dist/index.js");

  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = `http://${req.headers.host || `localhost:${PORT}`}${req.url || "/"}`;
        const hasBody = req.method !== "GET" && req.method !== "HEAD";
        const options = { method: req.method, headers: req.headers };
        if (hasBody) {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          options.body = Buffer.concat(chunks);
        }
        const request = new Request(url, options);
        const response = await handleRequest(request);
        res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
        if (response.body) {
          const reader = response.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(Buffer.from(value));
          }
        }
        res.end();
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end();
      }
    });
    server.on("error", reject);
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  let child = null;
  let httpServer = null;

  if (START_SERVER) {
    if (USE_FAST_SERVER) {
      console.log("Starting fast E2E server (handleRequest) on port", PORT, "...");
      httpServer = await startFastHttpServer();
      console.log("Server ready.");
    } else {
      console.log("Starting wrangler dev on port", PORT, "...");
      child = spawnWrangler();
      console.log("Waiting for server to be ready...");
      await waitForServer();
    }
  } else {
    console.log("Using existing server at", BASE);
    await waitForServer();
  }

  try {
    await runTests();
  } finally {
    if (child) {
      child.kill("SIGTERM");
      await sleep(500);
      if (child.exitCode === null) child.kill("SIGKILL");
    }
    if (httpServer) {
      await new Promise((r) => httpServer.close(r));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
