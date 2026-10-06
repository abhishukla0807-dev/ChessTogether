---
id: "statefulsets"
title: "StatefulSets"
readTime: "4 min"
summary: "Managing stateful applications requiring unique identities, stable network hostnames, and persistent disk bindings."
keyTakeaway: "Use StatefulSets when pods require persistent identity and dedicated persistent disks (e.g. database clusters)."
---

## 1. StatefulSet Guarantees

- Ordered deployment and scaling: pod-0, pod-1, pod-2.
- Stable network identity: pod-0 always retains hostname pod-0 across restarts.
- VolumeClaimTemplates: Automatically assigns a dedicated persistent volume to each pod ordinal.
- Ideal for databases, Kafka brokers, and Elasticsearch clusters.
