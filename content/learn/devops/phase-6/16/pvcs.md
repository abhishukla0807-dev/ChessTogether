---
id: "pvcs"
title: "PVCs"
readTime: "3 min"
summary: "PersistentVolumeClaims: A request for storage by a user, specifying capacity and access modes."
keyTakeaway: "Most cloud block disks (EBS) support only ReadWriteOnce; use EFS or NFS for shared multi-pod writes."
---

## 1. Access Modes

- ReadWriteOnce (RWO): Mounted as read-write by a single node (standard cloud EBS/disk).
- ReadOnlyMany (ROX): Mounted read-only by many nodes concurrently.
- ReadWriteMany (RWX): Mounted read-write by many nodes (NFS, AWS EFS).
