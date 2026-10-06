---
id: "blue-green-deployment"
title: "Blue-Green Deployment"
readTime: "4 min"
summary: "Running two identical production environments; testing new code on Green, then switching router traffic instantly."
keyTakeaway: "Blue-Green provides near-instant rollbacks by switching load balancer target groups, at the cost of double infrastructure."
---

## 1. Instant Cutover & Rollback

- Blue: Active live production handling all user traffic.
- Green: Idle environment deployed with new version and smoke-tested.
- Cutover: Router or load balancer switches target to Green.
- Rollback: If an issue occurs, flip traffic back to Blue in seconds.
