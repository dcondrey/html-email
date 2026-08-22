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
node framework/build/lint.mjs --profile house framework/dist/email.html

# A template
node scripts/build-template.mjs templates/cairn-wellness
node framework/build/lint.mjs --profile house templates/cairn-wellness/dist/email.html
```

Screenshots, placeholder assets, and the render smoke-test need the dev dependency:

```sh
npm ci
npm run build      # framework + every template
npm run lint       # lint every built output
npm test           # build + lint + the linter's own self-test
npm run smoke      # render each email in headless Chrome (light + dark)
npm run previews   # regenerate docs/preview/*.png
```

There are **two layers of checks**: `lint.mjs` validates the *HTML* (Gmail size, dark-mode metas,
bulletproof buttons, image widths, house-conformance invariants); `smoke.mjs` validates the *render*
(broken images, horizontal overflow, page errors — what lint cannot see).

The linter defaults to `--profile universal`, which is the client behaviour any email is subject to,
so it is safe to point at output from MJML or anything else. Anything in **this** repo must be linted
with `--profile house`, which adds the framework's own invariants (both dark-mode metas,
`<o:PixelsPerInch>96`, a `prefers-color-scheme` block, the hidden preheader). `npm run lint` already
does. Leave the profile off a repo target and three real failures pass silently.

## Before you open a PR

1. Rebuild any output you changed and **commit the built `dist/`** (CI asserts there is no drift).
2. `npm run lint` passes with **0 fail / 0 warn** on every affected output.
3. `npm run smoke` passes (no broken images, no overflow) if you touched markup or assets.
4. Verify in a real client or attach a rendered screenshot — say which client. Include light + dark
   if you touched color.
5. Fill in the PR checklist.

## Adding a template

Each design lives under `templates/<name>/` with its own `partials/`, `build/manifest.json`,
`build/content.json`, `assets/`, and `dist/`. Don't hand-copy an existing one — scaffold it:

```sh
node scripts/new-template.mjs acme-widgets "Acme Widgets"
node scripts/build-template.mjs templates/acme-widgets     # builds 0 fail / 0 warn out of the box
```

The scaffold is a complete, conformant starter (8 partials, manifest, `content.json`, and a
`scripts/generate-acme-widgets-assets.mjs` stub). From there:

1. **Retheme.** Edit the palette and any web font in `partials/00-document-open.html`, then the
   section partials. Keep the house conventions (see `framework/partials/` for the annotated
   reference): XHTML Transitional doctype, `role="presentation"` tables, fluid-hybrid `stack-column`
   divs in `[if mso]` ghost tables, bulletproof VML buttons, the hidden preheader, and the three-path
   dark mode. Google-font links **must** include `&display=swap` or FOIT hides all text.
2. **Write the copy** in `build/content.json`. A `{{field}}` a partial references but the JSON omits
   fails the build; a key no partial uses is warned. Terse, declarative, no em-dashes, no `lorem`,
   mock brand marked fictitious in the footer.
3. **Generate the art.** Implement the asset generator following `scripts/generate-cairn-assets.mjs`:
   layered SVG scenes rendered by headless Chrome at 2x. Constrain every content `<img>` with a
   `width`/`height` attribute matching its slot (Outlook draws at natural size otherwise). For a
   wordmark logo, measure the rendered width and clip to it (`fit: true`, `white-space:nowrap`) so a
   long brand name is never truncated — see the `fit` handling in `generate-meridian-assets.mjs`. If
   a template inverts, ship a light + dark logo and wire the `darkmode-hide`/`darkmode-show` swap.
4. **Verify.** `npm run lint` at **0 fail / 0 warn**, `npm run smoke` clean, and eyeball the render in
   both light and dark.
5. **Wire it in.** Add the template to the `build`, `lint`, and `assets` scripts in `package.json`,
   the build/lint steps in `.github/workflows/{ci,release}.yml`, and the README Templates table +
   gallery. `npm run previews` will produce its `docs/preview/<name>.png`.

## Commit messages

`<type>: <description>` — imperative, single line. Types: `fix`, `feat`, `refactor`, `test`, `docs`,
`perf`, `security`, `chore`, `ci`, `build`. The changelog is generated from these via git-cliff.

## Code of Conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md).
