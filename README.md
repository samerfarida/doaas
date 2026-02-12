# DOaaS — DevOps-as-a-Service

**One API. Zero seriousness. Infinite DevOps one-liners.**

_Because who has time for manual DevOps?_

![DOaaS - DevOps-as-a-Service](assets/DOaaS.png)

[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/samerfarida/doaas/badge)](https://scorecard.dev/viewer/?uri=github.com/samerfarida/doaas)
[![CI](https://github.com/samerfarida/doaas/actions/workflows/ci.yml/badge.svg)](https://github.com/samerfarida/doaas/actions/workflows/ci.yml)
[![CodeQL Analysis](https://github.com/samerfarida/doaas/actions/workflows/codeql.yml/badge.svg)](https://github.com/samerfarida/doaas/actions/workflows/codeql.yml)

**[doaas.dev](https://doaas.dev)** — Your new best friend in the chaotic world of DevOps. A magical genie for DevOps humor (no lamp, no three-wish limit). Hit an endpoint, get a fresh one-liner: blame messages, excuses, pep talks, reality checks, incident responses, and more. **Why take yourself seriously when you can DOaaS it?**

## Try it in 5 seconds

```bash
curl https://doaas.dev/random
```

Or blame someone in style: `curl "https://doaas.dev/blame?format=text"` — then thank us in standup.

---

## Why does this exist?

- Escape the endless "Did you try turning it off and on again?"
- Every team needs a scapegoat. Say hello to `/blame`.
- Make incident handling actually fun (yes, really).
- Typing `curl` is oddly satisfying. So is DOaaS.
- Turn DevOps from "oh no" into "oh wow!"

## ✨ What can it do?

**Full toolbox** — or hit [doaas.dev/help](https://doaas.dev/help) for the live list:

| Endpoint    | Vibe                                 |
| ----------- | ------------------------------------ |
| `/help`     | List everything (also at `/`)        |
| `/random`   | Surprise me from any endpoint        |
| `/blame`    | Pass the buck in style               |
| `/motivate` | Cheerleader in JSON or text          |
| `/incident` | Incident responses without the panic |

**Plus:** `/excuse`, `/thisisfine`, `/realitycheck`, `/deploy`, `/rollback`, `/lgtm`, `/standup`, `/meeting`, `/burnout`, `/alignment`, `/roadmap`, `/policy`, `/audit`, `/compliance`, `/risk`, `/yes`, `/no`, `/maybe`.

**Params:** `format=json|text` · `mode=normal|chaos|corporate|security|wholesome|toxic|sarcastic|devops` (omit for random).

---

## Usage

### curl

```bash
# Random message (JSON)
curl https://doaas.dev/random

# Blame in plain text (standup gold)
curl "https://doaas.dev/blame?format=text"

# Cheat sheet
curl https://doaas.dev/help
```

**Example JSON:**

```json
{
  "name": "motivate",
  "description": "Motivational quotes and phrases",
  "example": "Keep pushing forward!",
  "mode": "normal"
}
```

### Browser

Open **[doaas.dev/help](https://doaas.dev/help)** — one-stop shop for all endpoints.

### Bash / Zsh

Drop this in `.bashrc` or `.zshrc` and become a DOaaS ninja:

```bash
doaas() {
  local endpoint=$1
  local format=${2:-json}
  curl -s "https://doaas.dev/${endpoint}?format=${format}"
}
```

Then: `doaas motivate text` · `doaas blame json` · you get it.

---

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

We want **more than code** — new endpoints, funnier one-liners, better docs. See [CONTRIBUTING.md](CONTRIBUTING.md) to join the fun.

**Star us on GitHub** if DOaaS made you smile. Share it in standup. Blame the API. You know what to do.

---

Go forth and DOaaS like a boss. 🚀

## ⚙️ Query Parameters

- `mode`: normal | chaos | corporate | security | wholesome | toxic | sarcastic | devops (availability varies by endpoint). **Omit `mode`** to get a random mode from that endpoint’s supported modes; **set `?mode=...`** to return only that mode.
- `format`: json (default) | text
