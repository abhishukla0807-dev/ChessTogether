---
id: "container-registry"
title: "Container Registry"
readTime: "3 min"
summary: "Hosting and versioning Docker images privately on Docker Hub, GitHub Packages (GHCR), or AWS ECR."
keyTakeaway: "Never deploy with :latest tag in production; always deploy with an immutable Git commit SHA tag."
---

## 1. Pushing to ECR / GHCR

- Authenticate using CLI tokens.
- Tag images with Git commit SHA and SemVer tags (avoid relying solely on mutable :latest).

```
docker tag my-app:latest ghcr.io/org/my-app:v1.2.0
docker push ghcr.io/org/my-app:v1.2.0
```
