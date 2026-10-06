---
id: "control-plane"
title: "Control Plane"
readTime: "5 min"
summary: "The brain of the cluster: kube-apiserver, etcd, kube-scheduler, and kube-controller-manager."
keyTakeaway: "etcd is the single source of truth for the entire cluster; always take automated snapshots of etcd."
---

## 1. Control Plane Components

- kube-apiserver: Exposes the REST API; the only component that communicates with etcd.
- etcd: Highly-available distributed key-value store holding the entire cluster state.
- kube-scheduler: Assigns newly created Pods to optimal worker nodes based on resource requests and affinities.
- kube-controller-manager: Runs core controllers (Node lifecycle, ReplicaSet, Endpoints).
