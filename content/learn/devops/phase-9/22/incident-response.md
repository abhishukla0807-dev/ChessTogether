---
id: "incident-response"
title: "Incident Response"
readTime: "4 min"
summary: "Executing structured, calm responses during high-severity production outages."
keyTakeaway: "Focus first on mitigating user impact (e.g. rolling back), not on identifying the deep root cause during an active outage."
---

## 1. Incident Response Stages

- Triage: Confirm severity (P1/P2) and impact.
- Mitigate: Stop the bleeding (rollback, scale up, route traffic away).
- Resolve: Fix the root cause once service is restored.
- Review: Conduct a blameless postmortem.
