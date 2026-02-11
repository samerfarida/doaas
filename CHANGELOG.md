# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-11

### Added

- Initial release: DevOps-as-a-Service
- `/help` – List all endpoints and usage
- `/random` – Get a random message from any endpoint
- Endpoints: `/blame`, `/motivate`, `/incident`, `/excuse`, `/thisisfine`, `/realitycheck`, `/deploy`, `/rollback`, `/lgtm`, `/standup`, `/meeting`, `/burnout`, `/alignment`, `/roadmap`, `/policy`, `/audit`, `/compliance`, `/risk`, `/yes`, `/no`, `/maybe`
- Query params: `format=json|text`, `mode=normal|chaos|corporate|security|wholesome|toxic|sarcastic|devops` (per-endpoint)
- Scripts: `generate`, `validate`, `build`, `test`, `dev`, `deploy`
- CI workflow and contribution guidelines

[1.0.0]: https://github.com/samer.farida/doaas/releases/tag/v1.0.0
