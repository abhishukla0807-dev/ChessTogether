---
id: "load-balancers"
title: "Load Balancers"
readTime: "4 min"
summary: "Application Load Balancers (ALB, Layer 7) vs Network Load Balancers (NLB, Layer 4)."
keyTakeaway: "Use ALB for web APIs and microservices; use NLB for extreme throughput, gaming, or raw TCP/UDP protocols."
---

## 1. ALB vs NLB

- ALB (L7): Content-based routing (host/path rules), SSL termination, HTTP/2 and WebSocket support.
- NLB (L4): Ultra-low latency, handles millions of requests per second, preserves client source IP.
