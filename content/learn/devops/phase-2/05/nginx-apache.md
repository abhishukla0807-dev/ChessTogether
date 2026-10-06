---
id: "nginx-apache"
title: "Nginx / Apache"
readTime: "4 min"
summary: "Event-driven asynchronous web serving (Nginx) vs multi-process threaded models (Apache)."
keyTakeaway: "Use Nginx as an edge reverse proxy and static asset cache in front of your application servers."
---

## 1. Why Nginx Dominates

- Single master process with non-blocking event-driven worker processes.
- Handles 10,000+ concurrent connections per worker with negligible memory footprint (solves the C10K problem).
