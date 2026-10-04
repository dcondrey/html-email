# html-email Documentation

Welcome to the comprehensive documentation for the `html-email` framework. This project relies on a few fundamental, well-documented engineering decisions to ensure emails render correctly across the vast landscape of email clients.

## Table of Contents

### 1. Core Framework
- [**The 28 Cross-Client Quirks**](quirks.md)
  A detailed breakdown of every email client quirk this framework defends against, from Outlook's Word engine to Gmail's dark-mode inversion.
- [**Platform & Client Support Matrix**](clients.md)
  The target client landscape and rendering engine details for Apple Mail, Gmail, Outlook, Yahoo, and more.

### 2. Development & Testing
- [**Testing & ESP Integration**](testing.md)
  How to lint, fuzz-test, and run headless Chrome smoke tests for your emails. Plus, details on merge tags and one-click unsubscribe links.
- [**Pre-Send Checklist**](../tools/email-checklist/index.html)
  An interactive, browser-based checklist that guides you through setup, design, build, and send.

### 3. Repository Guidelines
- [**Contributing Guide**](../CONTRIBUTING.md)
  How to contribute to the project, set up the development environment, and author new features.
- [**Code of Conduct**](../CODE_OF_CONDUCT.md)
  Our commitment to an open and welcoming environment.
- [**Security Policy**](../SECURITY.md)
  How to report vulnerabilities securely.

---
*Return to the [Main Repository README](../README.md).*
