---
id: "health-checks"
title: "Health Checks"
readTime: "3 min"
summary: "Implementing /healthz and /readyz endpoints for load balancers and container orchestrators."
keyTakeaway: "Do not put external third-party API dependencies into liveness checks, or their downtime will crash your app."
---

## 1. Shallow vs Deep Checks

- Shallow Check (/healthz): Verifies web server is running and responding.
- Deep Check (/readyz): Checks connectivity to database, cache, and message brokers.
