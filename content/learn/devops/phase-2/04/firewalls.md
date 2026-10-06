---
id: "firewalls"
title: "Firewalls"
readTime: "4 min"
summary: "Network traffic filtering using packet inspection, stateful tracking, and cloud security groups."
keyTakeaway: "Default deny all incoming traffic; explicitly allow only required ports from trusted IP ranges."
---

## 1. Linux Firewalls

- iptables / nftables: Kernel-level packet filtering tables and chains (INPUT, OUTPUT, FORWARD).
- UFW (Uncomplicated Firewall): User-friendly iptables frontend on Ubuntu.

```
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```
