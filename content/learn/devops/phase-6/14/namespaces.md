---
id: "namespaces"
title: "Namespaces"
readTime: "3 min"
summary: "Virtual cluster partitioning for multi-tenancy, environment isolation, and resource quotas."
keyTakeaway: "Use namespaces to organize teams and environments, and apply ResourceQuotas to prevent runaway costs."
---

## 1. Organizing Clusters

- Default namespaces: default, kube-system, kube-public, kube-node-lease.
- Partition environments: development, staging, production on a shared cluster.
- Enforce ResourceQuotas and LimitRanges per namespace.
