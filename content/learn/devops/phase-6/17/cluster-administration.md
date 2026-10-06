---
id: "cluster-administration"
title: "Cluster Administration"
readTime: "4 min"
summary: "Node draining, cordon, certificates rotation, RBAC role management, and cluster upgrades."
keyTakeaway: "Always cordon and drain nodes before patching or terminating to prevent dropped user traffic."
---

## 1. Safe Node Maintenance

- kubectl cordon <node>: Marks node as unschedulable (no new pods placed).
- kubectl drain <node> --ignore-daemonsets: Gracefully evicts existing pods to other nodes.
- Perform maintenance, then 'kubectl uncordon <node>'.
