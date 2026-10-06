---
id: "alerting-obs"
title: "Alerting"
readTime: "4 min"
summary: "Creating actionable, high-signal alerts that notify engineers only when user experience is impaired."
keyTakeaway: "Alert on user pain (symptoms), not underlying causes; every alert must have a clear runbook link."
---

## 1. Eliminating Alert Fatigue

- Every alert must be actionable: if an alert fires and you do nothing, delete the alert.
- Alert on symptoms (e.g. error rate > 2%), not causes (e.g. single node CPU spike).
