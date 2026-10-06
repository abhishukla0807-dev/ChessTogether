---
id: "subnets-cidr"
title: "Subnets & CIDR"
readTime: "4 min"
summary: "Classless Inter-Domain Routing (CIDR) math and cloud Virtual Private Cloud (VPC) subnet allocation."
keyTakeaway: "Design VPC CIDR blocks carefully to prevent overlapping IP ranges when setting up VPC Peering."
---

## 1. CIDR Prefix Lengths

- /32: Single host IP.
- /24: 256 addresses (251 usable in AWS VPCs as 5 IPs are reserved).
- /16: 65,536 addresses (standard cloud VPC network block).
