# Changelog

All notable changes to this project are generated from the commit history.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) +
[Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0] - 2026-08-22

### Added

- Standalone linter CLI. Rules moved to `framework/build/rules.mjs` as a pure `analyze()` with no
  I/O and no `process.exit`; `lint.mjs` wraps it with `--profile`, `--json`, `--sarif`, `--quiet`
  and multiple file arguments, and is exposed as the `html-email-lint` bin.
- Two rule profiles. `universal` is client behaviour any email is subject to, so the linter can be
  pointed at MJML, React Email or Maizzle output; `house` adds this framework's own invariants and
  is what `npm run lint` and CI use.
- Ten more documented quirks gated, taking the rule set to 27: Outlook table gutters,
  `.ExternalClass`, `text-size-adjust`, iOS auto-linking, Apple reformatting, Outlook.com dark mode,
  MSO font fallback, explicit dark-mode backgrounds, plus image `display:block` and CSS
  `background-image` without a VML fallback as universal warnings.
- Property-based fuzzing of the rule set (`fuzz.test.js`, fast-check, dev-only), covering crashes,
  determinism, profile containment and pathological backtracking.
- Pages gallery: Open, Download and Copy HTML on every template and reference build, a
  "Lint your own email" section, and a favicon.

### Changed

- The publishable package is `html-email-lint`; `html-email` is taken on the npm registry by an
  unrelated project. `files` limits the published tarball to the CLI and the rule set.
- README restructured around a 10-second header and a 60-second quickstart, with a mermaid build
  diagram and collapsible deep dives.
- Quirks 8 and 12 corrected. The docs claimed an explicit `bgcolor` on every cell; no build did
  that. Background is declared on the element the dark CSS overrides, which the new
  `dark-bg-explicit` rule now enforces.

### Fixed

- Quadratic backtracking in the linter. The preheader matcher, the tag scan and the `<style>` block
  scan each rescanned to end-of-input per opener; 2.4MB of unterminated markup did not finish in two
  minutes and now analyzes in 4.3ms. Tag scanning is a single left-to-right pass.
- The release workflow linted with the weaker profile after the default changed, so a tagged release
  would not have caught a template that lost a house convention.

### Security

- Comment and tag stripping rewritten as explicit scanners. As regex replaces they read as broken
  sanitizers (CodeQL `js/incomplete-multi-character-sanitization`, two high alerts).
- The `master` ruleset was active but its ref condition matched no branches, so it protected
  nothing. It now applies to the default branch with required status checks.

### Added (initial release)

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
