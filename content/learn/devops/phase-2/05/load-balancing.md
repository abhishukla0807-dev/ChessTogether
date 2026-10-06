---
id: "load-balancing"
title: "Load Balancing"
readTime: "4 min"
summary: "Distributing incoming traffic across multiple backend instances for high availability and throughput."
keyTakeaway: "Stateless applications paired with Round Robin or Least Connections enable seamless horizontal auto-scaling."
---

## 1. Load Balancing Algorithms

- Round Robin: Sequentially distributes requests equally.
- Least Connections: Routes to the instance handling the fewest active connections.
- IP Hash: Routes same client IP to same backend (session stickiness).
- Health Checks: Automatically removes unhealthy instances from traffic rotation.
