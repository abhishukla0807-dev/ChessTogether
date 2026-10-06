---
id: "ssh"
title: "SSH"
readTime: "4 min"
summary: "Secure Shell key generation, authorized_keys, bastion jump hosts, and ssh-agent forwarding."
keyTakeaway: "Disable password authentication on all cloud instances; use Ed25519 keys and Bastion hosts."
---

## 1. Hardened SSH Configuration

- Use modern Ed25519 elliptic curve keys instead of legacy RSA 2048.
- Disable root login and password authentication in /etc/ssh/sshd_config.
- Use SSH config files (~/.ssh/config) to configure bastion jump proxies.

```
ssh-keygen -t ed25519 -C 'engineer@company.com'
ssh -J bastion.company.com private-node-01
```
