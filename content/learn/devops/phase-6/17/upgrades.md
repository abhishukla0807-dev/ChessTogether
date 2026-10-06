---
id: "upgrades"
title: "Upgrades"
readTime: "4 min"
summary: "Performing zero-downtime Kubernetes control plane and worker node version upgrades."
keyTakeaway: "Never skip minor versions (e.g. upgrade from 1.28 to 1.29, not directly to 1.30) to prevent API incompatibilities."
---

## 1. Upgrade Order

- 1. Backup etcd state snapshot.
- 2. Upgrade Control Plane (kube-apiserver, etcd, controller-manager).
- 3. Upgrade worker nodes one node at a time (drain -> upgrade kubelet -> uncordon).
