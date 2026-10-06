---
id: "persistent-volumes"
title: "Persistent Volumes"
readTime: "4 min"
summary: "Cluster-wide storage resources provisioned by administrators or dynamically via CSI storage classes."
keyTakeaway: "Use dynamic StorageClasses so persistent cloud volumes are provisioned automatically on demand."
---

## 1. PV Lifecycle

- PersistentVolume (PV): Represents real storage (AWS EBS volume, NFS share, Ceph block).
- StorageClass: Enables dynamic just-in-time provisioning of cloud block storage when requested by pods.
