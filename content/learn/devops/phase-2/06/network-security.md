---
id: "network-security"
title: "Network Security"
readTime: "4 min"
summary: "Defense in depth, VPC isolation, zero-trust network access, and DDoS mitigation."
keyTakeaway: "Do not rely on a single perimeter firewall; implement defense-in-depth at edge, VPC, and host levels."
---

## 1. Defense in Depth

- Edge: Cloudflare or AWS WAF mitigating volumetric DDoS and SQL injection.
- VPC: Strict security groups and network access control lists (NACLs).
- Host: Internal iptables and host-based intrusion detection systems (HIDS).
