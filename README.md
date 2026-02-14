<div align="center">

<h1>DOaaS - DevOps-as-a-Service</h1>

<img src="assets/DOaaS.png" alt="DOaaS - DevOps-as-a-Service Logo" width="200" height="200">

<p><em>Emotional support for your CI/CD pipeline 🔥</em></p>

</div>

<div align="center">

<a href="https://doaas.dev/help">Live demo</a> &nbsp; · &nbsp; <a href="https://doaas.dev/random?format=text">Try random</a> &nbsp; · &nbsp; <a href="INTEGRATIONS.md">Integrations</a>

</div>

[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/samerfarida/doaas/badge)](https://scorecard.dev/viewer/?uri=github.com/samerfarida/doaas)
[![CI](https://github.com/samerfarida/doaas/actions/workflows/ci.yml/badge.svg)](https://github.com/samerfarida/doaas/actions/workflows/ci.yml)
[![CodeQL Analysis](https://github.com/samerfarida/doaas/actions/workflows/codeql.yml/badge.svg)](https://github.com/samerfarida/doaas/actions/workflows/codeql.yml)

Welcome to **DOaaS** (<https://doaas.dev>) — the most important DevOps platform of 2026.

It doesn't deploy infrastructure.
It doesn't fix outages.
It doesn't reduce your cloud bill.

It does something far more critical:

**It gives your pipeline emotional support.**

Try it right now:

```bash
curl -s "https://doaas.dev/random?mode=chaos&format=text"
```

Example output:

```text
Deploying to prod. No rollback plan. Respect.
```

Because production is pain, and pain deserves an API.

## Why does this exist?

- **Production is hard.** On-call, red pipelines, and "did you try rebooting?" get old. DOaaS is a single API for levity—no meetings, no standup bingo, just one `curl`.
- **Teams need release valves.** Standup icebreakers, blame deflection, status pages, Slack bots—instant mood shift, same endpoint.
- **DevOps doesn’t have to be grim.** Less corporate jargon, more wit. Less "oh no," more "okay, we got this."

## ✨ What can it do?

Here’s the full toolbox (or hit `/help` for the live list):

- `/help` – List all endpoints and usage (also at `/`).
- `/random` – Get a random message from any endpoint.
- `/blame` – Pass the buck in style.
- `/motivate` – Cheerleader in JSON or plain text.
- `/incident` – Incident-style responses without the panic.

More endpoints: `/excuse`, `/thisisfine`, `/realitycheck`, `/deploy`, `/rollback`, `/lgtm`, `/standup`, `/meeting`, `/burnout`, `/alignment`, `/roadmap`, `/policy`, `/audit`, `/compliance`, `/risk`, `/yes`, `/no`, `/maybe`.

---

## 🚀 Quick Start

**1. Try it** — run this in your terminal:

```bash
curl -s "https://doaas.dev/random?mode=chaos&format=text"
```

**2. See everything** — full endpoint list at [doaas.dev/help](https://doaas.dev/help) (browser or `curl`).

**3. Go deeper** — Slack, GitHub Actions, shell functions, and more: [INTEGRATIONS.md](INTEGRATIONS.md).

---

## Usage

### curl

```bash
# Random (chaos mode)
curl -s "https://doaas.dev/random?mode=chaos&format=text"

# Blame, motivate, and more
curl -s "https://doaas.dev/blame?format=text"
curl -s "https://doaas.dev/motivate?format=text"
curl -s "https://doaas.dev/meeting?mode=corporate&format=text"
curl -s "https://doaas.dev/realitycheck?mode=security&format=text"

# List all endpoints
curl -s "https://doaas.dev/help"
```

### Browser

Open [doaas.dev/help](https://doaas.dev/help) in your browser to explore and try endpoints.

### Shell function

Add to `.bashrc` or `.zshrc`:

```bash
doaas() {
  local endpoint=$1
  local format=${2:-json}
  curl -s "https://doaas.dev/${endpoint}?format=${format}"
}
```

Then: `doaas motivate text`, `doaas blame json`, and so on. For a version with `mode` support and Fish/PowerShell, see [INTEGRATIONS.md](INTEGRATIONS.md#shell-functions--aliases).

### Terminal greeting

Get a DOaaS message every time you open a terminal — add to `~/.bashrc` or `~/.zshrc`:

```bash
[[ $- == *i* ]] && { echo ""; curl --max-time 2 -fsS "https://doaas.dev/random?mode=chaos&format=text" || true; echo; }
```

For a calmer (wholesome) variant, see [INTEGRATIONS.md](INTEGRATIONS.md#terminal-greeting-recommended).

---

## ⚙️ Query Parameters

- `mode`: normal (default) | chaos | corporate | security | wholesome | toxic | sarcastic | devops (availability varies by endpoint)
- `format`: json (default) | text

## Development

For local setup and all `npm` scripts, see [CONTRIBUTING.md](CONTRIBUTING.md#development-aka-how-to-poke-under-the-hood).

## 🔐 Security Notes

- Free plan folks: don’t be that person hammering the API—rate limits are real.
- Cache smartly or keep local copies to avoid becoming a DOaaS spammer.
- All endpoints have `Cache-Control: no-store` because fresh data is the best data.
- To report a vulnerability, see [SECURITY.md](SECURITY.md).

## 🧠 Philosophy

- DevOps: Where “It works on my machine” is the universal excuse.
- Automate everything, even your coffee breaks.
- If it’s not broken, add monitoring anyway.
- Blame is a team sport—pass it around generously.
- Remember: every incident is just a plot twist in your career story.

## Contributing

We want **more than code** — new endpoints, funnier one-liners, better docs. See [CONTRIBUTING.md](CONTRIBUTING.md) to join the fun.

[Star us on GitHub](https://github.com/samerfarida/doaas) if DOaaS made you smile. Share it in standup. Blame the API. You know what to do.

---

Go forth and DOaaS like a boss! 🚀
