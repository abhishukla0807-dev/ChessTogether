---
id: "worker-nodes"
title: "Worker Nodes"
readTime: "4 min"
summary: "The execution machines running your container workloads: kubelet, kube-proxy, and container runtime."
keyTakeaway: "kubelet communicates directly with the container runtime via the Container Runtime Interface (CRI)."
---

## 1. Node Components

- kubelet: Primary node agent ensuring containers described in PodSpecs are running and healthy.
- kube-proxy: Manages network rules on nodes, translating Service IPs to Pod IPs using iptables/IPVS.
- Container Runtime: OCI-compliant runtime (containerd, CRI-O) executing container processes.
