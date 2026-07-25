<!-- html-email: a hand-authored, zero-dependency cross-client HTML email framework. Project landing README. -->

<img align="right" width="130" height="130" hspace="40" alt="html-email logo" src="./docs/logo-light.png#gh-light-mode-only">
<img align="right" width="130" height="130" hspace="40" alt="html-email logo" src="./docs/logo-dark.png#gh-dark-mode-only">

# html-email

### A cross-client HTML email framework that never drops support

Hand-authored, zero-dependency, and built on one rule: never abandon a client<br>
while a single real person still uses it — from classic Outlook to dark mode.

<br clear="right">

<p align="center">
  <a href="https://github.com/dcondrey/html-email/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/dcondrey/html-email/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/dcondrey/html-email"><img alt="OpenSSF Scorecard" src="https://api.securityscorecards.dev/projects/github.com/dcondrey/html-email/badge"></a>
  <a href="https://slsa.dev"><img alt="SLSA Build Level 3" src="https://img.shields.io/badge/SLSA-Build%20L3-2ea44f.svg?logo=slsa&logoColor=white"></a>
  <a href="#quick-start"><img alt="Zero dependencies" src="https://img.shields.io/badge/dependencies-0-2ea44f.svg"></a>
  <a href="https://nodejs.org"><img alt="Node" src="https://img.shields.io/badge/node-%E2%89%A516-blue.svg?logo=node.js&logoColor=white"></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://orcid.org/0009-0003-1849-2963"><img alt="ORCID" src="https://img.shields.io/badge/ORCID-0009--0003--1849--2963-green.svg"></a>
</p>

Most email frameworks quietly abandon the awkward clients — classic Outlook, Android 4's stock mail,
Windows Phone — because supporting them is tedious. **html-email does the opposite.** It began in 2014
as "the most cross-compatible template you'll find anywhere," and it now covers **both** the 2014
client landscape **and** everything since: dark mode, the new Chromium Outlook, Apple Mail Privacy
Protection, one-click unsubscribe, and the accessibility expectations of VoiceOver/TalkBack. There is
**no MJML and no compiler** — the built output is the hand-tuned partials verbatim, so nothing is lost
in translation on the oldest clients.

## Why html-email

- **Never-drop-support.** Every fix degrades gracefully; no workaround breaks an older client to help
  a newer one. [28 documented quirks](./docs/quirks.md), each defended in the markup.
- **Zero dependencies.** A ~120-line `build.mjs` concatenates partials and injects `content.json`.
  No framework, no MJML, no fidelity loss. (Puppeteer is a *dev*-only dependency for screenshots.)
- **A linter, not just a template.** `lint.mjs` turns the load-bearing quirks into a build gate —
  Gmail's 102 KB clip and 8 KB `<style>` limit, bulletproof buttons, balanced MSO comments, `alt`
  text, a real unsubscribe link, `role="presentation"`.
- **Three ways to use it.** Copy the single-file master, assemble the documented partials, or run the
  build. All three produce identical markup.
- **Dark mode, three ways.** `prefers-color-scheme`, Outlook.com `[data-ogsc]`/`[data-ogsb]`, and
  Gmail-safe explicit `bgcolor` on every cell.
- **Branded templates.** A growing set of distinct designs (see below), each rebuilt in the house
  conventions and passing the linter clean.

## Preview

| Framework — light | Framework — dark | Mobile | Cairn Wellness template |
|:---:|:---:|:---:|:---:|
| ![Light](docs/preview/desktop-light.png) | ![Dark](docs/preview/desktop-dark.png) | ![Mobile](docs/preview/mobile.png) | ![Cairn Wellness](docs/preview/cairn-wellness.png) |

One source, no per-client forks. Screenshots are the Blink render; see [Testing](./docs/testing.md)
for real-client verification. **Live demo:** <https://dcondrey.github.io/html-email/>

## What's in the box

```
html-email/
├── framework/                 the maintained, modern template (start here)
│   ├── template.html          single-file master, fully commented
│   ├── partials/              the same template as documented components
│   ├── build/                 build.mjs (assembler) + lint.mjs + content.json
│   ├── dist/                  built output (email.html + email.min.html)
│   └── assets/                sample images
│
├── templates/                 distinct branded designs, house conventions
│   └── cairn-wellness/         partials + manifest + content.json + assets + dist
│
├── examples/
│   ├── northwind-botanicals/  the framework filled out as a real campaign
│   └── campaigns-2014/        original 2014 campaigns, kept as references
│
├── scripts/                   build-template.mjs, preview + asset generators
├── docs/                      quirks reference, client matrix, testing, previews
└── legacy/                    the preserved, unmodified 2014 artifact
```

## Quick start

Zero dependencies, Node ≥ 16.

**1. Copy the single file.** Open [`framework/template.html`](framework/template.html) — the whole
email in one commented file with `{{placeholders}}`. Replace them and ship.

**2. Assemble the partials.** [`framework/partials/`](framework/partials) breaks it into components
(`header`, `hero`, `columns`, `button`, `footer`, …). Paste the ones you need in order.

**3. Build it.**

```sh
cd framework/build
node build.mjs                 # inject content.json  → ../dist/email.html
node build.mjs --production    # + minify (strips docs, keeps MSO comments)
node lint.mjs ../dist/email.html
```

Build a branded template the same way:

```sh
node scripts/build-template.mjs templates/cairn-wellness
node framework/build/lint.mjs templates/cairn-wellness/dist/email.html
```

## Templates

| Template | Design | Status |
| --- | --- | --- |
| `framework/` | The canonical modern template (header · hero · columns · button · footer) | ✅ Maintained |
| `examples/northwind-botanicals/` | The 2014 production reference, scrubbed to a fictitious brand | ✅ |
| `templates/cairn-wellness/` | Wellness shop (green/cream/amber, Poppins) | ✅ |
| `templates/ferry-street-brewing/` | Brewery (amber/brown on dark roast, Oswald · 3-col tasting + gallery) | ✅ |
| `templates/lantern-and-quill/` | Bookshop / education (coral+yellow on plum, Playfair · team + product cards) | ✅ |
| `templates/voltline/` | Electronics sale, dark-first (dark+pink, Space Grotesk · date-list + pricing table) | ✅ |
| `templates/meridian-advisory/` | Consulting / corporate (charcoal+coral on grey, IBM Plex Sans · quote block) | ✅ |

Brand names and imagery are fictitious mock content for demonstration; imagery is self-authored,
generated by `scripts/`.

## Supply chain & provenance

Actions are pinned to full commit SHAs, and **CodeQL**, **Dependency Review**, **OpenSSF Scorecard**,
and **Dependabot** run in CI. Tagged releases publish a signed **[SLSA](https://slsa.dev)
build-provenance** attestation over the release archive (see `.github/workflows/release.yml`); verify
it with:

```sh
gh attestation verify html-email-<tag>.zip --repo dcondrey/html-email
```

Security policy and private reporting: [SECURITY.md](./SECURITY.md).

## Documentation

- [Quirks reference](./docs/quirks.md) — the 28 cross-client behaviours the framework defends against, explained
- [Platform support](./docs/clients.md) — the client matrix and market data
- [Testing & ESP integration](./docs/testing.md) — linting, real-client verification, merge tags, one-click unsubscribe
- [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md) · [Changelog](./CHANGELOG.md)

## License

MIT — use it, adapt it, ship it. Attribution appreciated, not required. © 2026 David Condrey.
