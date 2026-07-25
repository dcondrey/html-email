<!-- Keep it short. The checklist is the important part for an email repo. -->

## What & why

<!-- One or two sentences. What changed, and which client/behavior it addresses. -->

## Checklist

- [ ] `node framework/build/build.mjs` (and any `scripts/build-template.mjs <dir>`) rebuilt, output committed
- [ ] `node framework/build/lint.mjs <output>` passes (0 fail)
- [ ] Verified in a real client or a rendered screenshot (say which client)
- [ ] Preserves the never-drop-support rule — no fix that breaks an older client to help a newer one
- [ ] Stays zero-dependency (no MJML / compiler in the email build path)
- [ ] Copy has no em-dashes, no placeholder "lorem", no real third-party brand content

## Screenshots

<!-- Before/after or the rendered result. Light + dark if the change touches color. -->
