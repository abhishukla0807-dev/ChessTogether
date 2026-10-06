---
id: "replicasets"
title: "ReplicaSets"
readTime: "3 min"
summary: "Low-level controller ensuring a specified number of Pod replicas are running at any given moment."
keyTakeaway: "ReplicaSets handle pod count guarantees; Deployments manage ReplicaSets to provide zero-downtime rollouts."
---

## 1. How ReplicaSets Work

- Uses label selectors to identify and count active Pods.
- Deployments create a new ReplicaSet for every rollout and scale old ones down to zero.
