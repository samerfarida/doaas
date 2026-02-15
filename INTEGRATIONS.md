# DOaaS Integrations

All the ways you can call <https://doaas.dev> — from your terminal, scripts, CI/CD pipelines, shell aliases, and more.

**Base URL:** `https://doaas.dev`  
**Format:** `?format=json` (default), `?format=text`, or `?format=shields`  
**Mode:** `?mode=normal|chaos|corporate|security|wholesome|toxic|sarcastic|devops` (default: `normal`)

---

## Quick reference

| Endpoint                                       | Description              |
| ---------------------------------------------- | ------------------------ |
| `/help`                                        | List all endpoints       |
| `/random`                                      | Random from any endpoint |
| `/blame`                                       | Pass the buck in style   |
| `/motivate`                                    | Cheerleader quotes       |
| `/excuse`                                      | Classic excuses          |
| `/incident`                                    | Incident responses       |
| `/yes` / `/no` / `/maybe`                      | Binary decisions         |
| `/deploy` / `/rollback`                        | Deploy drama             |
| `/lgtm` / `/standup` / `/meeting`              | Meetings & reviews       |
| `/burnout` / `/alignment` / `/roadmap`         | Team vibes               |
| `/policy` / `/audit` / `/compliance` / `/risk` | Governance               |
| `/thisisfine` / `/realitycheck`                | Reality checks           |

---

## Terminal & CLI

### cURL

```bash
# Random message (JSON)
curl https://doaas.dev/random

# Plain text
curl "https://doaas.dev/blame?format=text"
curl "https://doaas.dev/motivate?mode=wholesome&format=text"

# Specific mode
curl "https://doaas.dev/excuse?mode=chaos&format=text"
```

### wget

```bash
wget -qO- "https://doaas.dev/random?format=text"
wget -qO- "https://doaas.dev/blame?format=text"
```

### HTTPie

```bash
http GET https://doaas.dev/random
http GET "https://doaas.dev/blame?format=text"
http GET "https://doaas.dev/motivate" mode==wholesome format==text
```

---

## Shell functions & aliases

### Bash / Zsh

Add to `.bashrc` or `.zshrc`:

```bash
doaas() {
  local endpoint=${1:-random}
  local format=${2:-json}
  local mode=$3
  local url="https://doaas.dev/${endpoint}?format=${format}"
  [[ -n "$mode" ]] && url="${url}&mode=${mode}"
  curl -s "$url"
}
```

**Usage:**

```bash
doaas blame text
doaas motivate text wholesome
doaas random json
```

### One-liner alias

```bash
alias blame='curl -s "https://doaas.dev/blame?format=text"'
alias motivate='curl -s "https://doaas.dev/motivate?format=text"'
alias excuse='curl -s "https://doaas.dev/excuse?format=text"'
```

### Fish shell

```fish
function doaas
  set endpoint "random"
  set format "json"

  if test (count $argv) -ge 1
    set endpoint $argv[1]
  end

  if test (count $argv) -ge 2
    set format $argv[2]
  end

  curl -s "https://doaas.dev/$endpoint?format=$format"
end
```

### PowerShell

```powershell
function doaas {
  param(
    [string]$Endpoint = "random",
    [string]$Format = "json",
    [string]$Mode = ""
  )
  $url = "https://doaas.dev/$Endpoint`?format=$Format"
  if ($Mode) { $url += "&mode=$Mode" }
  Invoke-RestMethod -Uri $url
}
```

---

## Scripts

### Node.js / JavaScript

```javascript
// Fetch API (Node 18+ / browsers)
const res = await fetch("https://doaas.dev/blame?format=text");
const msg = await res.text();
console.log(msg);
```

```javascript
// JSON response
const res = await fetch("https://doaas.dev/motivate?mode=wholesome");
const json = await res.json();
console.log(json.message);
```

### Python

```python
import urllib.request
import json

# Plain text
with urllib.request.urlopen("https://doaas.dev/blame?format=text") as r:
    print(r.read().decode())

# JSON
with urllib.request.urlopen("https://doaas.dev/random") as r:
    data = json.load(r)
    print(data["message"])
```

```python
# With requests
import requests
r = requests.get("https://doaas.dev/motivate?format=text")
print(r.text)
```

### Ruby

```ruby
require "net/http"
require "json"

uri = URI("https://doaas.dev/blame?format=text")
puts Net::HTTP.get(uri)
```

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type DOaaSResponse struct {
    Endpoint  string `json:"endpoint"`
    Mode      string `json:"mode"`
    Message   string `json:"message"`
    Timestamp string `json:"timestamp"`
}

func main() {
    // Plain text
    resp, _ := http.Get("https://doaas.dev/blame?format=text")
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))

    // JSON
    resp2, _ := http.Get("https://doaas.dev/random")
    defer resp2.Body.Close()

    var data DOaaSResponse
    json.NewDecoder(resp2.Body).Decode(&data)
    fmt.Println(data.Message)
}
```

### Rust (with reqwest)

```rust
let res = reqwest::get("https://doaas.dev/blame?format=text").await?.text().await?;
println!("{}", res);
```

---

## Terminal Greeting (Recommended)

Add this to your `~/.bashrc` or `~/.zshrc` to get a DOaaS message every time you open a terminal:

```bash
[[ $- == *i* ]] && { echo ""; curl --max-time 2 -fsS "https://doaas.dev/random?mode=chaos&format=text" || true; echo; }
```

Want something less chaotic?

```bash
[[ $- == *i* ]] && { echo ""; curl --max-time 2 -fsS "https://doaas.dev/motivate?mode=wholesome&format=text" || true; echo; }
```

---

## CI/CD

### GitHub Actions

```yaml
- name: Get motivation
  id: motivate
  run: |
    MSG=$(curl -s "https://doaas.dev/motivate?format=text")
    echo "message=$MSG" >> $GITHUB_OUTPUT
    echo "$MSG"

- name: Post blame on failure
  if: failure()
  run: |
    curl -s "https://doaas.dev/blame?format=text" | xargs -I {} echo "::error::{}"
```

```yaml
# Use in a job summary or Slack notification
- name: E2E passed — celebrate
  if: success()
  run: |
    MSG=$(curl -s "https://doaas.dev/motivate?format=text")
    echo "### 🎉 $MSG" >> $GITHUB_STEP_SUMMARY
```

### GitLab CI

```yaml
after_script:
  - |
    if [ "$CI_JOB_STATUS" == "failed" ]; then
      curl -s "https://doaas.dev/blame?format=text"
    fi
```

### Jenkins (Groovy)

```groovy
def msg = sh(script: 'curl -s "https://doaas.dev/excuse?format=text"', returnStdout: true).trim()
echo msg
```

### Azure DevOps

```yaml
- script: |
    MSG=$(curl -s "https://doaas.dev/motivate?format=text")
    echo "##vso[task.logissue type=message]$MSG"
  displayName: Daily motivation
```

### CircleCI

```yaml
- run:
    name: Motivation
    command: |
      curl -s "https://doaas.dev/motivate?format=text" || true
```

### Makefile

```makefile
.RECIPEPREFIX =
.PHONY: motivate blame excuse
motivate:
 @curl -s "https://doaas.dev/motivate?format=text"
blame:
 @curl -s "https://doaas.dev/blame?format=text"
excuse:
 @curl -s "https://doaas.dev/excuse?format=text"
```

---

## Slack & webhooks

### Slack incoming webhook

Use a custom workflow or app to POST to Slack. Example with `curl` and a Slack incoming webhook:

```bash
MSG=$(curl -s "https://doaas.dev/motivate?format=text")
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"$MSG\"}" \
  YOUR_SLACK_WEBHOOK_URL
```

### Discord webhook

```bash
MSG=$(curl -s "https://doaas.dev/blame?format=text")
curl -X POST -H 'Content-type: application/json' \
  --data "{\"content\":\"$MSG\"}" \
  YOUR_DISCORD_WEBHOOK_URL
```

---

## README & GitHub badges (Shields.io)

Use `format=shields` to return JSON in the [Shields.io Endpoint Badge](https://shields.io/badges/endpoint-badge) schema. Embed a dynamic DOaaS message in your README — the message updates when Shields refreshes its cache.

When using `format=shields`, you can pass these query parameters to customize the badge (all optional):

| Parameter    | Default                                | Description                                                              |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------ |
| `style`      | `flat`                                 | Badge style: `flat`, `flat-square`, `plastic`, `for-the-badge`, `social` |
| `label`      | `DOaaS` (random) or `DOaaS {endpoint}` | Left-side text (URL-encode spaces/special chars)                         |
| `color`      | `orange`                               | Right-side color (named or hex)                                          |
| `labelColor` | —                                      | Left-side color (named or hex)                                           |

Example: `https://doaas.dev/blame?format=shields&style=flat-square&color=blue`

**Cache:** To control how long Shields.io caches the badge, add `cacheSeconds` to the **Shields URL** (not the DOaaS URL), e.g. `https://img.shields.io/endpoint?url=...&cacheSeconds=3600`.

### Basic badge

Copy this into your README:

```markdown
![DOaaS](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Frandom%3Fformat%3Dshields)
```

Live example:

![DOaaS](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Frandom%3Fformat%3Dshields)

### Other endpoints

Replace `/random` in the URL with any endpoint (`/blame`, `/motivate`, `/excuse`, `/incident`, etc.):

```markdown
![DOaaS blame](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Fblame%3Fformat%3Dshields)
![DOaaS motivate](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Fmotivate%3Fformat%3Dshields)
```

Preview:

![DOaaS blame](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Fblame%3Fformat%3Dshields)
![DOaaS motivate](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Fmotivate%3Fformat%3Dshields)

Customize with query params (style, color, label, labelColor):

```markdown
![DOaaS](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Frandom%3Fformat%3Dshields%26style%3Dflat-square%26color%3Dblue)
```

### Clickable badge

Wrap the image in a link so the badge links to DOaaS:

```markdown
[![DOaaS](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Frandom%3Fformat%3Dshields)](https://doaas.dev)
```

### Try the API directly

See the JSON that powers the badge:

```bash
curl -s "https://doaas.dev/random?format=shields"
```

### Note

Shields.io caches responses (typically 5+ minutes), so the message updates when the cache expires rather than on every page load.

---

## Browser & developer tools

### Direct URL

Open in a browser:

```text
https://doaas.dev/help
https://doaas.dev/random?format=json
https://doaas.dev/blame?format=text
```

### DevTools / fetch (browser console)

```javascript
fetch("https://doaas.dev/random?format=text")
  .then((r) => r.text())
  .then(console.log);
```

---

## Other HTTP clients

### Postman / Insomnia

- **Method:** GET
- **URL:** `https://doaas.dev/blame`
- **Query params:** `format=text`, `mode=chaos` (optional)

### VS Code REST Client extension

```http
GET https://doaas.dev/random?format=json
GET https://doaas.dev/blame?format=text&mode=toxic
GET https://doaas.dev/random?mode=chaos&format=text
```

---

## Git Hooks

### Pre-push hook

Add a DOaaS reality check before pushing code.

Create a file:

```text
.git/hooks/pre-push
```

Make it executable:

```bash
chmod +x .git/hooks/pre-push
```

Contents:

```bash
#!/bin/bash
curl --max-time 2 -fsS "https://doaas.dev/realitycheck?mode=security&format=text" || true
```

---

## Summary

| Integration       | Example                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **Terminal**      | `curl "https://doaas.dev/blame?format=text"`                                                        |
| **Shell fn**      | `doaas blame text` (add to `.bashrc` / `.zshrc`)                                                    |
| **Node.js**       | `fetch("https://doaas.dev/random").then(r => r.json()).then(d => ...)`                              |
| **Python**        | `requests.get("https://doaas.dev/blame?format=text").text`                                          |
| **CI/CD**         | `curl -s "https://doaas.dev/blame?format=text"`                                                     |
| **Makefile**      | `@curl -s "https://doaas.dev/motivate?format=text"`                                                 |
| **Slack/Discord** | Use `curl` to get message, then POST to webhook                                                     |
| **Shields.io**    | `![DOaaS](https://img.shields.io/endpoint?url=https%3A%2F%2Fdoaas.dev%2Frandom%3Fformat%3Dshields)` |
| **Browser**       | Visit `https://doaas.dev/help`                                                                      |

All endpoints support CORS (`Access-Control-Allow-Origin: *`), so you can call them from any origin (web apps, browser extensions, etc.).
