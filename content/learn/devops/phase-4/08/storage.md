---
id: "storage"
title: "Storage"
readTime: "4 min"
summary: "Block storage, object storage, and distributed network filesystems in the cloud."
keyTakeaway: "Use S3 for static assets, backups, and user uploads; use EBS for single-instance transactional databases."
---

## 1. Cloud Storage Comparison

- EBS (Elastic Block Store): Persistent block storage attached to a single VM (like a virtual hard drive).
- S3 (Simple Storage Service): Highly durable (99.999999999%), scalable object store accessed via HTTP APIs.
- EFS (Elastic File System): Shared NFS filesystem accessible concurrently by hundreds of VMs/pods.
