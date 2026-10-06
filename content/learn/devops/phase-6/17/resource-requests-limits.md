---
id: "resource-requests-limits"
title: "Resource Requests & Limits"
readTime: "4 min"
summary: "CPU and memory guarantees (requests) and ceilings (limits) preventing resource starvation."
keyTakeaway: "Always set resource requests and limits on every container; without them, one rogue container can crash an entire node."
---

## 1. Memory vs CPU Behavior

- Requests: Used by the scheduler to find a node with enough room.
- Limits: Hard ceiling enforced by kernel cgroups.
- Exceeding CPU limit: Throttling (slowdown).
- Exceeding Memory limit: Out Of Memory (OOMKilled) termination.

```
resources:
  requests:
    memory: '256Mi'
    cpu: '250m'
  limits:
    memory: '512Mi'
    cpu: '500m'
```
