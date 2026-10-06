---
id: "probes"
title: "Probes"
readTime: "4 min"
summary: "Health checks: Liveness, Readiness, and Startup probes automating self-healing."
keyTakeaway: "Never restart a container that is just slow or overwhelmed—use Readiness probes, not aggressive Liveness probes."
---

## 1. The Three Probe Types

- Startup Probe: Verifies slow-starting applications have initialized.
- Liveness Probe: Detects deadlocks; if it fails, kubelet restarts the container.
- Readiness Probe: Detects if the app is ready to accept traffic; if it fails, the pod is removed from Service endpoints.
