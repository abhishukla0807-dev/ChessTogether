---
id: "secret-scanning"
title: "Secret Scanning"
readTime: "3 min"
summary: "Detecting accidentally committed credentials, private keys, and API tokens in git repositories."
keyTakeaway: "Enforce pre-commit secret scanning hooks so credentials can never be pushed to remote repositories."
---

## 1. Preventing Leaks

- Tools: Gitleaks, TruffleHog, GitHub Secret Scanning.
- Runs in pre-commit git hooks to prevent developers from ever pushing API keys.
