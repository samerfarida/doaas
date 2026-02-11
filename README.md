# DOaaS - DevOps-as-a-Service

_Because who has time for manual DevOps?_

<div align="center">
  <img src="assets/DOaaS.png" alt="DOaaS - DevOps-as-a-Service">
</div>

[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/samerfarida/doaas/badge)](https://scorecard.dev/viewer/?uri=github.com/samerfarida/doaas)
[![CI](https://github.com/samerfarida/doaas/actions/workflows/ci.yml/badge.svg)](https://github.com/samerfarida/doaas/actions/workflows/ci.yml)
[![CodeQL Analysis](https://github.com/samerfarida/doaas/actions/workflows/codeql.yml/badge.svg)](https://github.com/samerfarida/doaas/actions/workflows/codeql.yml)

Welcome to DOaaS.dev (<https://doaas.dev>), your new best friend in the chaotic world of DevOps. Think of it as a magical genie for DevOps humor-minus the three-wish limit and the questionable lamp. DOaaS.dev is an API that serves up funny one-liners: blame messages, excuses, pep talks, reality checks, incident responses, and more. Hit an endpoint, get a fresh sentence. Because why take yourself seriously when you can DOaaS it?

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

_Also: `/excuse`, `/thisisfine`, `/realitycheck`, `/deploy`, `/rollback`, `/lgtm`, `/standup`, `/meeting`, `/burnout`, `/alignment`, `/roadmap`, `/policy`, `/audit`, `/compliance`, `/risk`, `/yes`, `/no`, `/maybe`. Use `format=json|text`. Omit `mode` for a random mode per request, or set `mode=normal|chaos|corporate|...` to filter._

## Usage (aka How to make DOaaS your new BFF)

### Via curl

Because nothing says "I’m a pro" like terminal commands:

Get a random message from any endpoint in JSON (because you deserve some variety):

```bash
curl https://doaas.dev/random
```

**Example output (JSON):**

```json
{
  "name": "motivate",
  "description": "Motivational quotes and phrases",
  "example": "Keep pushing forward!",
  "mode": "normal"
}
```

**Example output (plain text)** — use `?format=text`:

```
Blame the last person who touched the code.
```

Get a blame message in plain text (perfect for those awkward team meetings):

```bash
curl "https://doaas.dev/blame?format=text"
```

Need a quick refresher on what DOaaS offers? Here’s your cheat sheet:

```bash
curl https://doaas.dev/help
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

## ⚙️ Query Parameters

- `mode`: normal | chaos | corporate | security | wholesome | toxic | sarcastic | devops (availability varies by endpoint). **Omit `mode`** to get a random mode from that endpoint’s supported modes; **set `?mode=...`** to return only that mode.
- `format`: json (default) | text
