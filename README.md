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

- To save you from the endless "Did you try turning it off and on again?"
- Because every team needs a scapegoat (hello, /blame).
- To inject some fun into incident handling (yes, really).
- Because typing `curl` is oddly satisfying.
- And most importantly, to make DevOps less "oh no" and more "oh wow!"

## ✨ What can it do?

Here’s the full toolbox (or hit `/help` for the live list):

- `/help` – List all endpoints and usage (also at `/`).
- `/random` – Get a random message from any endpoint.
- `/blame` – Pass the buck in style.
- `/motivate` – Cheerleader in JSON or plain text.
- `/incident` – Incident-style responses without the panic.

More endpoints:

- `/excuse`
- `/thisisfine`
- `/realitycheck`
- `/deploy`
- `/rollback`
- `/lgtm`
- `/standup`
- `/meeting`
- `/burnout`
- `/alignment`
- `/roadmap`
- `/policy`
- `/audit`
- `/compliance`
- `/risk`
- `/yes`
- `/no`
- `/maybe`

## Usage (aka How to make DOaaS your new BFF)

### Via curl

Quick examples:

```bash
# Random DOaaS wisdom
curl -s "https://doaas.dev/random?format=text"

# Chaos mode (recommended)
curl -s "https://doaas.dev/random?mode=chaos&format=text"

# Blame generator
curl -s "https://doaas.dev/blame?format=text"

# Corporate meeting simulator
curl -s "https://doaas.dev/meeting?mode=corporate&format=text"

# Security reality check
curl -s "https://doaas.dev/realitycheck?mode=security&format=text"

# List all endpoints
curl -s "https://doaas.dev/help"
```

### In Browser

For those who prefer clicking over typing, just navigate to:

```text
https://doaas.dev/help
```

Your one-stop shop for all endpoint goodness.

### In Terminal with Bash Function

Make your life easier by adding this magic to your `.bashrc` or `.zshrc`:

```bash
doaas() {
  local endpoint=$1
  local format=${2:-json}
  curl -s "https://doaas.dev/${endpoint}?format=${format}"
}
```

Then summon DOaaS with:

```bash
doaas motivate text
```

Because typing less is winning.

## 🖥️ Terminal Greeting (Highly Recommended)

Add this to your `~/.bashrc` or `~/.zshrc` and DOaaS will greet you every time you open a terminal:

```bash
[[ $- == *i* ]] && curl --max-time 2 -fsS "https://doaas.dev/random?mode=chaos&format=text" || true
```

Now every terminal session starts with wisdom, chaos, or emotional damage.

## 🚀 Quick Start (for the impatient)

1. Get inspired with a random message:

```bash
curl https://doaas.dev/random
```

2. Blame your teammate (politely):

```bash
curl "https://doaas.dev/blame?format=text"
```

3. Or just add the bash function and become a DOaaS ninja:

```bash
doaas motivate json
```

## ⚙️ Query Parameters

- `mode`: normal (default) | chaos | corporate | security | wholesome | toxic | sarcastic | devops (availability varies by endpoint)
- `format`: json (default) | text

## Development (aka How to poke under the hood)

- `npm run generate` – Cook up your endpoints file fresh from the oven.
- `npm run validate` – Make sure your JSON files aren’t secretly broken.
- `npm run build` – Compile all the magic before you test your spells.
- `npm run test` – Run the tests and prove your code is worthy.
- `npm run test:stress` – Run 10k requests against the worker (run after `npm run build`).
- `npm run dev` – Fire up the local dev server with Wrangler and watch the magic happen.

## 🔐 Security Notes

- Free plan folks: don’t be that person hammering the API—rate limits are real.
- Cache smartly or keep local copies to avoid becoming a DOaaS spammer.
- All endpoints have `Cache-Control: no-store` because fresh data is the best data.

## 🧠 Philosophy

- DevOps: Where “It works on my machine” is the universal excuse.
- Automate everything, even your coffee breaks.
- If it’s not broken, add monitoring anyway.
- Blame is a team sport—pass it around generously.
- Remember: every incident is just a plot twist in your career story.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to join the fun and help DOaaS grow.

---

Go forth and DOaaS like a boss! 🚀
