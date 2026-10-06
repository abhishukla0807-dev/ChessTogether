---
id: "package-management"
title: "Package Management"
readTime: "3 min"
summary: "Installing, upgrading, and auditing system dependencies across Debian/Ubuntu (apt) and RHEL (yum/dnf)."
keyTakeaway: "Always pin package versions in production server images to ensure deterministic builds."
---

## 1. Package Repositories

- APT (Debian/Ubuntu): apt update, apt install, apt upgrade.
- DNF/YUM (CentOS/RHEL/Fedora): dnf install, dnf check-update.
- Pinning package versions prevents breaking changes during automated server provisioning.
