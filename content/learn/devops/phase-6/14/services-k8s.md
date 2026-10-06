---
id: "services-k8s"
title: "Services"
readTime: "4 min"
summary: "Stable networking abstraction providing a static IP address and DNS name across ephemeral Pods."
keyTakeaway: "Services use label selectors to dynamically discover and route traffic to healthy Pod endpoints."
---

## 1. Internal Load Balancing

- Pods get destroyed and recreated with changing IP addresses.
- A Service provides a permanent virtual IP (ClusterIP) and load balances traffic across matching Pods.
