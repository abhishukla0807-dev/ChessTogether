---
id: "service-types"
title: "Service Types"
readTime: "4 min"
summary: "ClusterIP, NodePort, LoadBalancer, and ExternalName service exposure modes."
keyTakeaway: "Use ClusterIP for internal service-to-service communication; use Ingress controllers for public HTTP traffic."
---

## 1. Service Types

- ClusterIP (Default): Internal virtual IP accessible only within the cluster.
- NodePort: Exposes service on a static port (30000-32767) across every worker node's IP.
- LoadBalancer: Provisions a native cloud load balancer (AWS NLB/ALB) routing to the Service.
- ExternalName: CNAME alias mapping internal DNS to an external domain.
