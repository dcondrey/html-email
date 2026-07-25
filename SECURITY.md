# Security Policy

## Supported Versions

Fixes are applied to `master`; there is no long-term support branch yet.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Open a private advisory via
[GitHub Security Advisories](https://github.com/dcondrey/html-email/security/advisories/new),
or email **davidcondrey@gmail.com**.

Please include a description of the issue and its impact, steps to reproduce, and the affected
version/commit. You can expect an initial response within a few days; coordinated disclosure is
appreciated.

## Threat model for an email framework

This project produces static HTML email. The realistic security surface is small but real:

- **Injection into rendered output.** `content.json` values are substituted verbatim into markup.
  Treat them as trusted authoring input, not untrusted user data. If you wire the build to
  user-supplied content, HTML-escape values before injection.
- **Link and image destinations.** Templates ship with `#` / example placeholders. Review every
  `href`/`src` before sending; do not leave tracking or third-party URLs you did not intend.
- **Unsubscribe & compliance.** The linter requires an unsubscribe link (CAN-SPAM / CASL / GDPR /
  RFC 8058). Keep it real, not a placeholder.

## Supply-chain security

- All GitHub Actions are pinned to full commit SHAs.
- **OpenSSF Scorecard**, **CodeQL**, **Dependency Review**, and **Dependabot** run in CI.
- Tagged releases publish a signed **SLSA build-provenance** attestation over the release archive
  (see `.github/workflows/release.yml`).
