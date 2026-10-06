---
id: "users-groups"
title: "Users & Groups"
readTime: "3 min"
summary: "Identity management, UID/GID mappings, and sudo privilege escalation."
keyTakeaway: "Create dedicated service accounts with no login shells for running background daemon services."
---

## 1. User Account Administration

- /etc/passwd: Stores user identity, home dir, default shell, and GID.
- /etc/shadow: Stores salted password hashes securely.
- /etc/sudoers: Configures granular root privilege escalation.

```
useradd -m -s /bin/bash deployer
usermod -aG docker deployer
```
