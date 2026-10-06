---
id: "k8s-secrets"
title: "Secrets"
readTime: "4 min"
summary: "Storing sensitive data (passwords, tokens, TLS keys) encoded in Base64 within etcd."
keyTakeaway: "Never commit raw Kubernetes Secret YAMLs to Git; use External Secrets Operator to fetch secrets at runtime."
---

## 1. Secret Security in K8s

- K8s native secrets are only Base64-encoded, NOT encrypted by default.
- Enable encryption at rest for etcd in control plane configurations.
- Use External Secrets Operator or Sealed Secrets to sync secrets securely from AWS Secrets Manager or HashiCorp Vault.
