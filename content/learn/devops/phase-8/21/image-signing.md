---
id: "image-signing"
title: "Image Signing"
readTime: "4 min"
summary: "Cryptographically signing container images using Sigstore Cosign to guarantee provenance and authenticity."
keyTakeaway: "Use Cosign image signing to ensure Kubernetes only deploys images created by your approved CI pipeline."
---

## 1. Cosign Verification

- Signs the image in CI using ephemeral keys and OIDC.
- Admission controllers (Kyverno, Gatekeeper) verify the cryptographic signature before allowing pods to run in the cluster.

```
cosign sign --yes ghcr.io/org/my-app:v1.0.0
cosign verify ghcr.io/org/my-app:v1.0.0
```
