# framework/

The maintained, modern template. For the full quirks reference and platform
matrix, see the [root README](../README.md). This file is the working quickstart.

## Files

| Path | What it is |
|---|---|
| `template.html` | The whole email in one commented file, with `{{placeholders}}`. Copy it, fill it in. |
| `partials/` | The same template as documented components (see below). |
| `build/build.mjs` | Zero-dependency assembler. Concatenates partials + injects `content.json`. |
| `build/content.json` | Your copy, links, image URLs, and ESP merge tags. |
| `dist/` | Build output: `email.html` (readable) and `email.min.html` (minified). |
| `assets/` | Sample images so the built preview renders standalone. Replace with yours. |

## Partials, in assembly order

| File | Component |
|---|---|
| `00-document-open.html` | Doctype, `<head>`, all resets, dark mode, wrapper open. **The reference file.** |
| `10-preheader.html` | Inbox preview text (include-only). |
| `20-header.html` | Logo bar with dark-mode logo swap. |
| `30-hero.html` | Hero image + headline + paragraph + CTA slot. |
| `35-hero-bg.html` | *Optional* hero with text laid **over** a background image (VML bulletproof background). Swap it for `30-hero.html` in the manifest. |
| `40-columns.html` | Two columns that stack on mobile (fluid-hybrid). Duplicate for more rows. |
| `50-button.html` | Bulletproof VML + `<a>` button (include-only). |
| `60-footer.html` | Social, address, unsubscribe. |
| `99-document-close.html` | Closes container, ghost table, wrapper. |

`preheader` and `button` are pulled in with `{{>preheader}}` / `{{>button}}`
includes, so they aren't in the top-level manifest.

## Build

```bash
cd build
node build.mjs                 # → ../dist/email.html   (content injected)
node build.mjs --production    # → ../dist/email.html   (minified)
node build.mjs --skeleton --out ../template.html        # regenerate the fill-in master
node lint.mjs ../dist/email.html                        # enforce the cross-client rules
# or: npm run build / build:prod / skeleton / lint / verify (build+lint)
```

`lint.mjs` fails the build if the email would break a documented rule — over
Gmail's 102 KB clip or 8 KB `<style>` limit, an image without `alt`, unbalanced
MSO conditionals, a missing unsubscribe link — so a regression is caught before
it reaches an inbox.

The minifier strips **documentation** comments and collapses whitespace but
never touches `<!--[if mso]>` conditional comments — those are functional.

## Customising

- **Content:** edit `build/content.json` (or the `{{placeholders}}` in
  `template.html` directly).
- **Colours:** brand button colour is `buttonBg`; footer/dark tones live in
  `00-document-open.html`'s `<style>` and `60-footer.html`.
- **More rows:** copy the `40-columns.html` block; for a 4-up grid set each
  column's `max-width` to ~135px and add two more `.stack-column` divs with
  matching MSO ghost `<td>`s.
- **Layout order:** reorder the `MANIFEST` array in `build.mjs`.

## Before you send

Host `assets/` on an absolute `https://` URL, keep every `alt`, run it through
Litmus/Email on Acid, and open a real test in Gmail, Apple Mail, and Outlook
(both classic and new) in light **and** dark mode.
