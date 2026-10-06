---
id: "k8s-dns"
title: "DNS"
readTime: "3 min"
summary: "Internal cluster DNS resolution powered by CoreDNS for microservice discovery."
keyTakeaway: "CoreDNS allows pods to discover and call any service in the cluster using standard human-readable hostnames."
---

## 1. FQDN Naming Convention

- Format: <service-name>.<namespace>.svc.cluster.local.
- Within the same namespace: simply call http://backend-service:8080.
- Across namespaces: call http://backend-service.staging.svc.cluster.local:8080.
