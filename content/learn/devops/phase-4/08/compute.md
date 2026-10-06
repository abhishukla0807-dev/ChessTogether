---
id: "compute"
title: "Compute"
readTime: "4 min"
summary: "Virtual instances, instance types, spot instances, and auto-scaling groups."
keyTakeaway: "Use Spot instances in Kubernetes worker pools to cut cloud compute bills dramatically."
---

## 1. Instance Categories (AWS EC2)

- General Purpose (t4g, m6i): Balanced compute, memory, and networking.
- Compute Optimized (c6i): High compute power for batch processing and media encoding.
- Memory Optimized (r6i): High RAM for in-memory databases (Redis) and distributed caches.
- Spot Instances: Surplus cloud compute at up to 90% discount; ideal for stateless batch jobs.
