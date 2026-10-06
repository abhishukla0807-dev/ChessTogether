---
id: "container-scanning"
title: "Container Scanning"
readTime: "4 min"
summary: "Scanning container base images and OS packages for vulnerabilities prior to deployment."
keyTakeaway: "Automate container image scanning in your CI/CD pipeline and fail builds that introduce critical CVEs."
---

## 1. Scanning in CI

- Tools: Trivy, Grype, AWS ECR image scanning.
- Scans base OS packages (openssl, glibc) inside built Docker images.

```
trivy image --severity HIGH,CRITICAL my-app:v1.2.0
```
