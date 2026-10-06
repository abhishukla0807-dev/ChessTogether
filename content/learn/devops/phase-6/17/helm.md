---
id: "helm"
title: "Helm"
readTime: "4 min"
summary: "The package manager for Kubernetes: templating YAML manifests, managing releases, and values.yaml."
keyTakeaway: "Use Helm to manage third-party tools (Prometheus, Cert-Manager, Ingress) with versioned, reproducible releases."
---

## 1. Helm Concepts

- Chart: A bundle of templated Kubernetes manifests.
- values.yaml: Configuration overrides per environment.
- Release: A running instance of a chart in the cluster.

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install my-ingress ingress-nginx/ingress-nginx -f values.prod.yaml
helm list
helm rollback my-ingress 1
```
