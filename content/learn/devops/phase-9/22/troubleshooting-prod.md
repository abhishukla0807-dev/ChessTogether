---
id: "troubleshooting-prod"
title: "Troubleshooting"
readTime: "4 min"
summary: "Methodical root cause analysis without guessing or making random production changes."
keyTakeaway: "Over 70% of production outages are caused by recent changes; always check recent deployments first."
---

## 1. The Scientific Method of Debugging

- What changed recently? (Deployments, configuration updates, traffic spikes, cloud provider incidents).
- Formulate a hypothesis, test it with non-destructive queries, and observe metrics before taking action.
