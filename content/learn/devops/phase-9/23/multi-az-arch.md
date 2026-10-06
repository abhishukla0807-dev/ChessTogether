---
id: "multi-az-arch"
title: "Multi-AZ Architecture"
readTime: "3 min"
summary: "Spanning microservice clusters across multiple independent data center failure domains."
keyTakeaway: "Enforce topology spread constraints so a datacenter outage takes down at most 33% of your application pods."
---

## 1. Pod Topology Spread Constraints

- Use Kubernetes topologySpreadConstraints to ensure pods are evenly distributed across availability zones.
