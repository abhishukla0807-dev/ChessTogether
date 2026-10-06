---
id: "labels-selectors"
title: "Labels & Selectors"
readTime: "3 min"
summary: "Key-value metadata used to organize, group, and query Kubernetes objects dynamically."
keyTakeaway: "Labels are the primary querying and routing mechanism in Kubernetes; establish strict organizational tagging rules."
---

## 1. The Glue of Kubernetes

- Deployments use matchLabels to know which Pods belong to them.
- Services use selectors to route incoming requests to target Pods.
- kubectl get pods -l app=api,env=production
