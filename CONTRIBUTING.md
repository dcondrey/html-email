# Contributing to html-email

Thanks for considering a contribution. This is a hand-authored, zero-dependency HTML email
framework whose one rule is **never drop support for the oldest clients**. The most valuable
contributions are new client workarounds, new partials/templates, and lint rules that turn a
hard-won quirk into an automated check.

## Ground rules

- **Never-drop-support.** No fix that breaks an older client to help a newer one. Degrade
  gracefully instead (VML fallbacks, ghost tables, `bgcolor` alongside CSS).
- **Zero dependencies in the email build path.** No MJML, no HTML compiler. The output must be the
  hand-tuned partials verbatim. (Puppeteer is a *dev* dependency, used only for screenshots and
  placeholder-asset generation.)
- **Copy hygiene.** No em-dashes, no `lorem ipsum`, and no real third-party brand content — mock
  brands only, marked fictitious in the footer.

## Development setup

No install is needed to build or lint (Node 16+):

```sh
# Framework
node framework/build/build.mjs                      # dist/email.html (preview)
node framework/build/build.mjs --production          # + strip doc comments, collapse whitespace
node framework/build/lint.mjs framework/dist/email.html

# A template
node scripts/build-template.mjs templates/cairn-wellness
node framework/build/lint.mjs templates/cairn-wellness/dist/email.html
```

Screenshots and placeholder assets need the dev dependency:

```sh
npm ci
node scripts/generate-previews.mjs
```

## Before you open a PR

1. Rebuild any output you changed and **commit the built `dist/`** (CI asserts there is no drift).
2. `lint.mjs` passes with **0 fail** on every affected output.
3. Verify in a real client or attach a rendered screenshot — say which client. Include light + dark
   if you touched color.
4. Fill in the PR checklist.

## Adding a template

Each design lives under `templates/<name>/` with its own `partials/`, `build/manifest.json`,
`build/content.json`, `assets/`, and `dist/`. Author sections in the house conventions (see
`framework/partials/` for the annotated reference): XHTML Transitional doctype, `role="presentation"`
tables, fluid-hybrid `stack-column` divs wrapped in `[if mso]` ghost tables, bulletproof VML buttons,
the hidden-preheader technique, and `color-scheme` + dark-mode classes. Aim for `lint.mjs` **0 warn**.

## Commit messages

`<type>: <description>` — imperative, single line. Types: `fix`, `feat`, `refactor`, `test`, `docs`,
`perf`, `security`, `chore`, `ci`, `build`. The changelog is generated from these via git-cliff.

## Code of Conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md).
