# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **More taglines (batch 3/3)** — New one-liners per mode for: `standup`, `thisisfine`, `yes`. Content follows CONTRIBUTING.md guardrails and is subject to PR moderation.

## [1.2.0] - 2026-02-19

### Added

- **Content guardrails for `endpoints/`** — New or changed one-liners in `endpoints/*.json` are checked on every pull request via the [OpenAI Moderation API](https://developers.openai.com/api/docs/guides/moderation) (`omni-moderation-latest`). Content classified as harmful (harassment, hate, violence, self-harm, sexual, illicit, etc.) is rejected and the PR cannot be merged until the content is updated. Aligns with Code of Conduct requirements.
- **Moderation workflow improvements** — Run only when files under `endpoints/**` change (path filter); update the existing bot comment in place instead of posting a new one each push; skip empty or whitespace-only new strings before calling the API.
- **Documentation** — Guardrails and moderation categories documented in CONTRIBUTING.md, SECURITY.md, and README.md (Security Notes). Testing guide at `.github/docs/MODERATION_TESTING.md`.

### Fixed

- **Moderation script** — Run as CommonJS in GitHub Actions to avoid ESM resolution issues.
- **Security** — Resolve minimatch ReDoS vulnerabilities via npm overrides; address object-injection lint warnings; scope `npm audit` to production deps in CI where appropriate.
- **Lint and format** — Resolve issues in the moderation script and pipeline.

### Changed

- Bumped `wrangler` and `@cloudflare/workers-types` (Dependabot).

## [1.1.0] - 2026-02-15

### Added

- **`format=shields`** — Returns [Shields.io Endpoint Badge](https://shields.io/badges/endpoint-badge) schema for embedding dynamic DOaaS messages in README badges. Use with `https://img.shields.io/endpoint?url=https://doaas.dev/random?format=shields`.
- **Shields query params** — When `format=shields`, optional: `style` (default `flat`), `label` (default `DOaaS` or `DOaaS {endpoint}`), `color` (default `orange`), `labelColor`. All endpoints support these; documented in OpenAPI schema and INTEGRATIONS.md.

## [1.0.0] - 2026-02-11

### Added

- **We're live.** DOaaS is out in the wild — one API, zero seriousness, infinite DevOps one-liners.
- **Initial release:** DevOps-as-a-Service at [doaas.dev](https://doaas.dev)
- `/help` – List all endpoints and usage
- `/random` – Get a random message from any endpoint
- **20+ endpoints:** `/blame`, `/motivate`, `/incident`, `/excuse`, `/thisisfine`, `/realitycheck`, `/deploy`, `/rollback`, `/lgtm`, `/standup`, `/meeting`, `/burnout`, `/alignment`, `/roadmap`, `/policy`, `/audit`, `/compliance`, `/risk`, `/yes`, `/no`, `/maybe`
- Query params: `format=json|text`, `mode=normal|chaos|corporate|security|wholesome|toxic|sarcastic|devops` (per-endpoint)
- Scripts: `generate`, `validate`, `build`, `test`, `dev`, `deploy`
- CI workflow and contribution guidelines

[1.2.0]: https://github.com/samerfarida/doaas/releases/tag/v1.2.0
[1.1.0]: https://github.com/samerfarida/doaas/releases/tag/v1.1.0
[1.0.0]: https://github.com/samerfarida/doaas/releases/tag/v1.0.0
