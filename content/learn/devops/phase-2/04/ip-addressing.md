---
id: "ip-addressing"
title: "IP Addressing"
readTime: "3 min"
summary: "IPv4 and IPv6 structures, public routable vs private RFC 1918 address allocations."
keyTakeaway: "Never assign public IPs to database or backend tiers; keep them inside RFC 1918 private subnets."
---

## 1. RFC 1918 Private Ranges

- 10.0.0.0 – 10.255.255.255 (10.0.0.0/8): Large enterprise clouds.
- 172.16.0.0 – 172.31.255.255 (172.16.0.0/12): Default Docker bridge networks.
- 192.168.0.0 – 192.168.255.255 (192.168.0.0/16): Home & small office networks.
