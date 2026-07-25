# Changelog

All notable changes to this project are generated from the commit history.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) +
[Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added

- Framework layer: `template.html` master, numbered partials, zero-dependency `build.mjs` assembler,
  and `lint.mjs` enforcing the documented cross-client rules.
- `examples/northwind-botanicals/` — the 2014 production reference campaign, content-scrubbed to a
  fictitious brand with the compatibility engineering preserved.
- `templates/cairn-wellness/` — first branded template rebuilt in the house conventions, driven by a
  generalized `scripts/build-template.mjs`.
- Four more branded templates, each a distinct design with a fictitious brand and self-authored
  generated art, verified in light and dark: `ferry-street-brewing/` (brewery, Oswald, 3-column
  tasting + gallery), `lantern-and-quill/` (bookshop, Playfair, team + product cards),
  `voltline/` (dark-first electronics sale, Space Grotesk, date-list + pricing table), and
  `meridian-advisory/` (consulting, IBM Plex Sans, quote block). Each ships a
  `scripts/generate-<name>-assets.mjs`; a light/dark logo swap is used where a template inverts.
- `tools/email-checklist/` — a self-contained, zero-dependency pre-send checklist (vanilla JS,
  localStorage persistence, progress bar), rebuilt from the legacy jQuery + Google-Sheets version
  whose data feed was shut down in 2021. The 2014 original is preserved under `legacy/`.
- `lint.mjs`: an image-width rule (every `<img>` must carry a width attribute, since Outlook draws
  at natural size and oversized sources overflow the 600px layout), plus a self-test
  (`lint.test.mjs` with good/bad fixtures) wired into `npm test` and CI.
- Both builders now fail on a `{{field}}` missing from `content.json` (instead of shipping it
  literally) and warn on content keys no partial uses.
- Self-contained placeholder imagery and preview screenshots generated via headless Chrome;
  `scripts/generate-previews.mjs` now also renders a showcase image per template.
- GitHub Pages landing page with a branded-template gallery, and preview screenshots
  (light, dark, mobile).
- Project scaffolding: CI, CodeQL, Dependency Review, OpenSSF Scorecard, SLSA release provenance,
  Dependabot, issue/PR templates, and community health files.
