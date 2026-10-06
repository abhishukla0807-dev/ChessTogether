---
id: "canary-deployment"
title: "Canary Deployment"
readTime: "4 min"
summary: "Routing a tiny fraction of live user traffic (e.g. 5%) to the new release while monitoring error rates before 100% rollout."
keyTakeaway: "Canary releases eliminate deployment anxiety by verifying real user error metrics before full production rollout."
---

## 1. Progressive Delivery

- Minimizes blast radius: if a critical bug slips through, only 5% of users experience it.
- Tools like Argo Rollouts or Flagger automate traffic shifting based on Prometheus metrics.
