---
id: "auto-scaling-adv"
title: "Auto Scaling"
readTime: "4 min"
summary: "Proactive and reactive scaling strategies to handle massive dynamic traffic surges."
keyTakeaway: "Scale up fast to protect latency; scale down slowly with cooldown periods to prevent thrashing."
---

## 1. Scaling Strategies

- Target Tracking: Scale instances to keep average CPU at 60%.
- Step Scaling: Aggressive additions during sudden spikes.
- Scheduled Scaling: Pre-warm compute ahead of known marketing events.
