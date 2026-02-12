# Contributing to DOaaS

**Make the internet weirder. One endpoint at a time.**

Thanks for wanting to make DOaaS funnier and more useful. We want this to be the API that shows up in standups, Slack, and "that one curl command" — and that happens with your help.

## What Counts as Contributing

We want **more than just code**. You can:

- **Add a new endpoint** — Drop a new JSON file in `endpoints/` and give the world another silly API to call.
- **Punch up existing endpoints** — Add more jokes, new variations, or delightfully weird edge cases (keep it family-friendly).
- **Improve descriptions & examples** — Make stuff clearer _and_ more entertaining. Boring docs are optional.

If you're only here to fix a typo or refactor something, that's cool too. But we especially love contributions that make people laugh or raise an eyebrow.

## Guidelines (the serious-ish part)

- Follow the JSON schema for endpoint files (name, description, modes, examples). Copy `endpoints/_template.json` when creating a new endpoint.
- New endpoints live in `endpoints/` as JSON files (files starting with `_` are ignored).
- Run `npm run validate` before submitting PRs.
- Run `npm run generate` to update generated files.
- Add tests in `tests/worker.test.mjs` for new functionality.
- Run `npm run lint`, `npm run lint:md`, and `npm run format:check` (or `npm run format` to fix). Pre-commit hooks run audit, format, lint, and markdown lint on staged files.
- Write commit messages that a human can understand (no "fix stuff" unless it's actually fixing stuff).

## Development

- `npm run generate` – Regenerate the endpoints file from JSON.
- `npm run validate` – Validate endpoint JSON files.
- `npm run build` – Build the worker.
- `npm run test` – Run tests.
- `npm run test:stress` – Run 10k requests (run after `npm run build`).
- `npm run dev` – Start the local dev server with Wrangler.

## How to Contribute

1. Fork the repo. You know the drill.
2. Create a branch for your feature, fix, or comedy routine.
3. Make your changes (code, new endpoints, funnier content—whatever floats your boat).
4. Validate and generate: `npm run validate`, `npm run generate`.
5. Lint and test: `npm run lint`, `npm run lint:md`, `npm test`. Pre-commit hooks run `npm audit --audit-level=high`, format, lint, and markdown lint on staged files.
6. Open a pull request and fill out the template so we know what you did (and whether it's supposed to be funny).

## Code of Conduct

Be respectful and constructive. We're here to have fun, not to be mean.

- **No hate or harassment**: No personal attacks, bullying, dogpiling, or targeting individuals or groups.
- **No slurs or discriminatory language**: Racism, sexism, homophobia, transphobia, ableism, or any other kind of bigotry is not welcome here.
- **No NSFW or abusive content**: Keep jokes and endpoints safe for a friendly, mixed audience.
- **Punch up, not down**: Humor is encouraged, but never at the expense of marginalized people or coworkers.
- **Assume good intent**: If something lands wrong, be open to feedback and willing to adjust.

---

Thanks for helping make DOaaS the kind of thing people actually share. We appreciate you. 🙌
