---
id: "cloud-dns"
title: "DNS"
readTime: "3 min"
summary: "Managed cloud DNS with Route 53: latency routing, geolocation, and automated failover."
keyTakeaway: "Pair Route 53 health checks with Failover routing to achieve automated multi-region disaster recovery."
---

## 1. Advanced Routing Policies

- Latency-Based Routing: Directs users to the cloud region with the lowest ping.
- Failover Routing: Automatically switches to a backup disaster recovery region if health checks fail.
