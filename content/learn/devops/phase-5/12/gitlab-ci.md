---
id: "gitlab-ci"
title: "GitLab CI/CD"
readTime: "4 min"
summary: "Single-application DevOps platform with built-in Auto DevOps, container registry, and .gitlab-ci.yml pipelines."
keyTakeaway: "GitLab CI provides a seamless all-in-one platform from issue tracking to security scanning and Kubernetes deployment."
---

## 1. GitLab Runner Architecture

- Lightweight Go-based runner agents polling GitLab for pipeline jobs.
- Native Docker-in-Docker (dind) and Kubernetes executor integration.
