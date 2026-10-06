---
id: "ingress"
title: "Ingress"
readTime: "4 min"
summary: "Layer 7 HTTP/HTTPS reverse proxy controller routing public internet traffic to internal cluster Services."
keyTakeaway: "Ingress centralizes SSL termination, path-based routing, and rate-limiting at the cluster perimeter."
---

## 1. Ingress vs LoadBalancer

- Creating a LoadBalancer service for every API is expensive and hard to manage.
- An Ingress Controller (Nginx Ingress, Traefik, AWS ALB Controller) uses a single external IP to route hundreds of domains and paths.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: api.chesskit.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```
