---
id: "code-review"
title: "Code Review"
readTime: "3 min"
summary: "Constructive peer review catches architectural bugs, security misconfigurations, and technical debt."
keyTakeaway: "Review for idempotency, security risks, zero hardcoded secrets, and failure rollback plans."
---

## 1. DevOps Review Checklist

- Infrastructure changes: Check for state locks, destructive resource recreations, and least-privilege IAM.
- Configuration files: Ensure zero secrets are hardcoded; use environment variables or secret managers.
- Idempotency: Verify automation scripts can run repeatedly without altering desired state.
