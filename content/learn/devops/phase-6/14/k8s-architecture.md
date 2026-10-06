---
id: "k8s-architecture"
title: "Architecture"
readTime: "5 min"
summary: "Kubernetes cluster architecture: declarative reconciliation loops, master nodes, and worker nodes."
keyTakeaway: "Kubernetes is a continuous reconciliation engine: controllers loop endlessly to make actual state equal desired state."
---

## 1. Declarative Reconciliation

- You submit a desired state YAML manifest to the API server.
- Controllers continuously compare desired state against actual state and make adjustments to converge them.
