---
id: "serverless"
title: "Serverless"
readTime: "4 min"
summary: "Event-driven compute with AWS Lambda: zero idle cost, instant scaling, and execution limits."
keyTakeaway: "Serverless is phenomenal for background tasks, webhook handlers, and cron jobs."
---

## 1. Serverless Trade-Offs

- Pros: Pay only for milliseconds executed; zero infrastructure patching or OS management.
- Cons: Cold start latency, 15-minute execution limit, statelessness requires external DB connection pooling.
