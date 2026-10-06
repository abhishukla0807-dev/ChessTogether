---
id: "recreate-deployment"
title: "Recreate Deployment"
readTime: "3 min"
summary: "Terminating all old version instances before launching new version instances (causes brief downtime)."
keyTakeaway: "Avoid Recreate deployments for user-facing production systems due to inevitable downtime."
---

## 1. When to Use Recreate

- Used when two versions of the app CANNOT run concurrently due to database locks or legacy architectures.
- Acceptable only during scheduled maintenance windows for internal tools.
