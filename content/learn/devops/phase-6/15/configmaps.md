---
id: "configmaps"
title: "ConfigMaps"
readTime: "3 min"
summary: "Decoupling configuration artifacts from container image binaries using key-value pairs or configuration files."
keyTakeaway: "Use ConfigMaps for non-confidential configuration; use Secrets for passwords, certificates, and API tokens."
---

## 1. Mounting ConfigMaps

- Inject as environment variables into Pod containers.
- Mount as configuration files inside a volume (e.g. mounting nginx.conf).
