---
id: "secure-cicd"
title: "Secure CI/CD"
readTime: "4 min"
summary: "Hardening pipeline runners, preventing script injection, and securing build secrets."
keyTakeaway: "Use OpenID Connect (OIDC) to authenticate CI/CD pipelines with cloud providers without storing static API keys."
---

## 1. CI/CD Security Best Practices

- Use OIDC (OpenID Connect) to authenticate CI runners with cloud providers instead of permanent long-lived AWS keys.
- Pin GitHub Actions to specific full commit SHAs, not mutable version tags (@v4).
- Run CI jobs in isolated ephemeral containers with minimal permissions.
