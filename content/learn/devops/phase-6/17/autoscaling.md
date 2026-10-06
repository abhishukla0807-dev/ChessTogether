---
id: "autoscaling"
title: "Autoscaling"
readTime: "4 min"
summary: "Horizontal Pod Autoscaler (HPA), Vertical Pod Autoscaler (VPA), and cluster autoscaling (Karpenter)."
keyTakeaway: "Karpenter dynamically provisions right-sized EC2 instances in under 45 seconds when pods need compute."
---

## 1. Autoscaling Layers

- HPA: Scales pod replica count horizontally based on CPU/memory or custom Prometheus metrics.
- Cluster Autoscaler / Karpenter: Provisions new EC2 worker nodes just-in-time when pods are Pending.
