---
id: "linux-security"
title: "Linux Security"
readTime: "4 min"
summary: "Hardening server operating systems, disabling unnecessary ports, and kernel security modules."
keyTakeaway: "Automate OS security updates and enforce fail2ban to mitigate brute-force attacks."
---

## 1. Server Hardening Steps

- Uninstall unused packages and disable unnecessary background services.
- Enable automatic security patch updates (unattended-upgrades).
- Configure fail2ban to automatically block brute-force SSH attempts.
- Enforce SELinux or AppArmor mandatory access control profiles.
