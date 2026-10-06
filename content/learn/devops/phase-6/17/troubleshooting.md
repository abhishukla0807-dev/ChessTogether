---
id: "troubleshooting"
title: "Troubleshooting"
readTime: "5 min"
summary: "Debugging common pod failures: CrashLoopBackOff, ImagePullBackOff, Pending, OOMKilled, and Evicted."
keyTakeaway: "Memorize the debugging flow: kubectl get pods -> kubectl describe pod -> kubectl logs --previous."
---

## 1. Common Failures & Root Causes

- ImagePullBackOff: Typo in image name, missing registry credentials, or tag doesn't exist.
- CrashLoopBackOff: Application crashed on boot; check 'kubectl logs --previous'.
- Pending: Insufficient CPU/memory across all nodes; check 'kubectl describe pod'.
- OOMKilled (Exit Code 137): Container exceeded its memory limit; increase memory limit in PodSpec.
