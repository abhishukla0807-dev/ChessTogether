---
id: "service-discovery-adv"
title: "Service Discovery"
readTime: "3 min"
summary: "Service meshes (Istio, Linkerd) providing mutual TLS, traffic splitting, and distributed observability."
keyTakeaway: "Service meshes automate zero-trust mutual TLS (mTLS) between all microservices without changing application code."
---

## 1. Service Mesh Features

- Sidecar proxies (Envoy) mediate all pod-to-pod network traffic transparently.
- Enforces mTLS encryption and granular traffic splitting for canary deployments.
