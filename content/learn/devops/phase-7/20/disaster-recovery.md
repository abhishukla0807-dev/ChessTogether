---
id: "disaster-recovery"
title: "Disaster Recovery"
readTime: "4 min"
summary: "Strategies for recovering systems after catastrophic datacenter or cloud region failures."
keyTakeaway: "Design DR architectures around business RTO (downtime allowed) and RPO (data loss allowed)."
---

## 1. Core DR Metrics

- RTO (Recovery Time Objective): How quickly must the system be restored? (e.g. within 1 hour).
- RPO (Recovery Point Objective): How much data loss can be tolerated? (e.g. maximum 5 minutes of transactions).
