---
id: "rolling-deployment"
title: "Rolling Deployment"
readTime: "4 min"
summary: "Gradually replacing old instance pods with new version instances one batch at a time with zero downtime."
keyTakeaway: "Rolling deployments require application v1 and v2 to be compatible with the database at the exact same time."
---

## 1. How It Works

- Standard deployment mode in Kubernetes (maxSurge and maxUnavailable).
- Ensures total capacity never drops below required threshold during rollout.
