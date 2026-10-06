---
id: "secrets"
title: "Secrets"
readTime: "4 min"
summary: "Secure secret management avoiding hardcoded tokens using Vault, AWS Secrets Manager, and Doppler."
keyTakeaway: "A single leaked API key in a public Git repository can compromise your entire cloud infrastructure in minutes."
---

## 1. The Golden Rule of Secrets

- Never commit passwords, private keys, or API tokens into Git repositories.
- Use tools like git-secrets, gitleaks, or trufflehog in pre-commit hooks to block leaks.
- Fetch secrets dynamically at application runtime from a centralized secret store.
