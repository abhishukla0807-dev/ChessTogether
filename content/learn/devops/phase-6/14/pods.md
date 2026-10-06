---
id: "pods"
title: "Pods"
readTime: "4 min"
summary: "The smallest deployable compute unit in Kubernetes, wrapping one or more tightly coupled containers."
keyTakeaway: "Never create standalone Pods; always manage Pods via Deployments, StatefulSets, or DaemonSets."
---

## 1. Pod Characteristics

- Containers in a Pod share the same network namespace (IP address and localhost) and storage volumes.
- Sidecar Pattern: Helper container (logging agent, proxy) running alongside the main application container.
- Pods are ephemeral and mortal—never deploy bare Pods directly in production.
