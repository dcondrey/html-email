# Platform support

Coverage target: **every client with real-world usage, current or legacy.** Market-share figures are
Litmus, May 2026 (≈1B opens).

| Client | Rendering engine | Status | Notes |
|---|---|---|---|
| **Apple Mail** — macOS | WebKit | ✅ Full | 64.66% of all opens (incl. iOS). Dark mode via `prefers-color-scheme`. |
| **Mail** — iOS / iPadOS | WebKit | ✅ Full | Auto-linking & auto-scaling neutralised (quirks 13–15). |
| **Gmail** — webmail | Google | ✅ High | Own dark-mode inversion (quirk 8); strips `<style>` over 8KB or with any CSS error (quirk 27); desktop ignores media queries (quirk 28). |
| **Gmail app** — iOS / Android | Google | ✅ High | Since 2016 `<style>` is honoured; keep inline styles as backup. |
| **Outlook** — Windows, *classic* 2007–2021 | **Word** | ✅ Supported | The hard one. VML buttons/backgrounds, ghost tables, 96-DPI fix. Retires Oct 2026 but the installed base persists. |
| **Outlook** — Windows, *new* ("Monarch") | Chromium | ✅ Full | Default since 2024. Modern CSS; ignores MSO comments, so it uses the standard code path. |
| **Outlook.com** — web | Chromium-class | ✅ High | Partial dark-mode inversion via `[data-ogsc]`/`[data-ogsb]` (quirk 11). |
| **Outlook** — macOS | WebKit | ✅ Full | |
| **Outlook** — iOS / Android app | Custom | ✅ High | |
| **Yahoo Mail / AOL** | Shared platform | ✅ High | Honours `<style>` and media queries; explicit units required. |
| **Samsung Mail** | AOSP-derived | ✅ High | Supports `prefers-color-scheme`; inflates undersized text. |
| **Android stock / AOSP mail (4.x)** | WebKit | ✅ Via fluid-hybrid | No media-query support — layout still adapts (quirk 21). |
| **Windows Phone 7/8 mail** | IE (Trident) | ✅ Supported | `X-UA-Compatible`, viewport, no unsupported CSS relied upon. |
| **Windows 10/11 Mail** | EdgeHTML/Chromium | ✅ High | |
| **Thunderbird** | Gecko | ✅ Full | |
| **BlackBerry / legacy mobile** | Various | ✅ Graceful | Single-column fallback, styled alt text, semantic order. |
| **ProtonMail / Fastmail / Hey** | Modern web | ✅ High | Strip/rewrite some CSS; template degrades cleanly. |

## Sources

Client behaviour and market data verified against:

- [Litmus — Email Client Market Share (May 2026)](https://www.litmus.com/email-client-market-share)
- [Email on Acid — Will the New Outlook be Better for Developers?](https://www.emailonacid.com/blog/article/industry-news/new-outlook-for-windows/) (Word→Chromium transition, Oct 2026 retirement)
- [Litmus — Guide to Rendering Differences in Microsoft Outlook](https://www.litmus.com/blog/a-guide-to-rendering-differences-in-microsoft-outlook-clients)
- [Litmus — Ultimate Guide to Dark Mode for Email](https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers)
- [Email on Acid — Dark Mode for Email](https://www.emailonacid.com/blog/article/email-development/dark-mode-for-email/)
- [Can I email…](https://www.caniemail.com/) — CSS/HTML feature support database
