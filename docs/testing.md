# Testing & ESP integration

## Lint before you look

The framework enforces its own rules — run the linter on any built email. It turns the
[quirks](./quirks.md) from advice into a gate.

```sh
cd framework/build
npm run lint        # or: node lint.mjs ../dist/email.html
npm run verify      # build + lint in one step
```

`lint.mjs` **fails the build** if the file exceeds Gmail's 102 KB clip, if the `<style>` block passes
Gmail's 8 KB strip limit or has unbalanced braces, if any image lacks `alt`, if MSO conditional
comments don't balance, or if the unsubscribe link is missing — and **warns** on missing
`role="presentation"` and unguarded pure black/white.

## Verify in real clients

Rendering can't be trusted to one machine. Before every send:

- **Litmus** or **Email on Acid** for the full client grid (both cover classic *and* new Outlook,
  Gmail dark mode, Apple Mail, Samsung).
- **[caniemail.com](https://www.caniemail.com/)** to check any CSS feature's support before you rely
  on it.
- Send a real test to yourself and open it in **Gmail (light + dark)**, **Apple Mail (light + dark)**,
  and **Outlook (classic + new)** at minimum — these three cover >95% of opens and the widest
  behavioural spread.

The `scripts/generate-previews.mjs` screenshots (Blink render, headless Chrome) are a fast first look,
not a substitute for real-client testing.

## Integrating with your ESP

- **Merge tags.** Leave your platform's tokens in the content, e.g. Mailchimp `*|FNAME|*`,
  `*|UNSUB|*`, `*|ARCHIVE|*`; the build doesn't touch them.
- **CSS inlining.** The template keeps a `<style>` block for media queries and dark mode (which
  *cannot* be inlined) and inlines everything else. If your ESP auto-inlines, that's fine — inlining
  the presentational styles is belt-and-braces for clients that strip `<style>`.
- **Stay under 102 KB.** Gmail clips messages larger than ~102 KB, hiding your footer and unsubscribe
  link. `--production` keeps you well under; the build prints a warning if you cross the line.
- **One-click unsubscribe (2024+).** Gmail and Yahoo require bulk senders to support RFC 8058
  one-click unsubscribe — set via the `List-Unsubscribe` / `List-Unsubscribe-Post` *headers* (your
  ESP sends these), plus a real unsubscribe link in the footer, which the template includes.
- **Host images absolutely.** Email cannot use relative image paths in production. Upload `assets/` to
  your CDN/ESP and use absolute `https://` URLs. Always keep the `alt` text.
