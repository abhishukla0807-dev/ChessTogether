---
id: "service-discovery"
title: "Service Discovery"
readTime: "3 min"
summary: "How client pods discover dynamic IP addresses of backend pods through Endpoints and EndpointSlices."
keyTakeaway: "EndpointSlices provide high-performance, scalable tracking of pod IP addresses as deployments scale up and down."
---

## 1. EndpointSlices

- Kubernetes automatically tracks healthy pod IPs in EndpointSlice objects.
- Scales service discovery cleanly to clusters with thousands of pods.
