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

## Development (aka How to poke under the hood)

- `npm run generate` – Cook up your endpoints file fresh from the oven.
- `npm run validate` – Make sure your JSON files aren’t secretly broken.
- `npm run build` – Compile all the magic before you test your spells.
- `npm run test` – Run the tests and prove your code is worthy.
- `npm run test:stress` – Run 10k requests against the worker (run after `npm run build`).
- `npm run dev` – Fire up the local dev server with Wrangler and watch the magic happen.

## How to Contribute

1. Fork the repo. You know the drill.
2. Create a branch for your feature, fix, or comedy routine.
3. Make your changes (code, new endpoints, funnier content—whatever floats your boat).
4. Validate and generate: `npm run validate`, `npm run generate`.
5. Lint and test: `npm run lint`, `npm run lint:md`, `npm test`. Pre-commit hooks run `npm audit --audit-level=high`, format, lint, and markdown lint on staged files.
6. Open a pull request and fill out the template so we know what you did (and whether it's supposed to be funny).

## Guardrails: content moderation for `endpoints/`

We use **guardrails** to keep endpoint content safe and aligned with our [Code of Conduct](#code-of-conduct). All new or changed one-liners in `endpoints/` are inspected via the [OpenAI Moderation API](https://developers.openai.com/api/docs/guides/moderation). **Content that is classified as harmful is rejected** — the PR check fails and the contribution cannot be merged until the content is changed or removed.

The following [content classifications](https://developers.openai.com/api/docs/guides/moderation) are checked; content flagged under any of these categories will be rejected:

| Category                   | What we reject                                                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **harassment**             | Content that expresses, incites, or promotes harassing language towards any target.                                                                         |
| **harassment/threatening** | Harassment that includes violence or serious harm towards any target.                                                                                       |
| **hate**                   | Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste. |
| **hate/threatening**       | Hateful content that includes violence or serious harm towards the targeted group.                                                                          |
| **illicit**                | Content that gives advice or instruction on how to commit illicit acts.                                                                                     |
| **illicit/violent**        | Illicit content that also includes references to violence or procuring a weapon.                                                                            |
| **self-harm**              | Content that promotes, encourages, or depicts acts of self-harm (e.g. suicide, cutting, eating disorders).                                                  |
| **self-harm/intent**       | Content where the speaker expresses that they are engaging or intend to engage in self-harm.                                                                |
| **self-harm/instructions** | Content that encourages self-harm or gives instructions on how to commit such acts.                                                                         |
| **sexual**                 | Content meant to arouse or that promotes sexual services (excluding sex education and wellness).                                                            |
| **sexual/minors**          | Sexual content that includes an individual under 18.                                                                                                        |
| **violence**               | Content that depicts death, violence, or physical injury.                                                                                                   |
| **violence/graphic**       | Content that depicts death, violence, or physical injury in graphic detail.                                                                                 |

We use the `omni-moderation-latest` model. For full definitions and API details, see [Moderation \| OpenAI API](https://developers.openai.com/api/docs/guides/moderation).

## Code of Conduct

Be respectful and constructive. We're here to have fun, not to be mean.

- **No hate or harassment**: No personal attacks, bullying, dogpiling, or targeting individuals or groups.
- **No slurs or discriminatory language**: Racism, sexism, homophobia, transphobia, ableism, or any other kind of bigotry is not welcome here.
- **No NSFW or abusive content**: Keep jokes and endpoints safe for a friendly, mixed audience.
- **Punch up, not down**: Humor is encouraged, but never at the expense of marginalized people or coworkers.
- **Assume good intent**: If something lands wrong, be open to feedback and willing to adjust.

---

Thanks for helping make DOaaS the kind of thing people actually share. We appreciate you. 🙌
