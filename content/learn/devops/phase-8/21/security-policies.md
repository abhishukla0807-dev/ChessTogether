---
id: "security-policies"
title: "Security Policies"
readTime: "4 min"
summary: "Enforcing governance and compliance rules across Kubernetes clusters with Kyverno and OPA Gatekeeper."
keyTakeaway: "Use Kyverno or OPA Gatekeeper to automatically reject non-compliant manifests before they enter the cluster."
---

## 1. Admission Policies

- Disallow privileged containers.
- Require all images to come from your private registry.
- Enforce CPU/memory limits on all deployed pods.
