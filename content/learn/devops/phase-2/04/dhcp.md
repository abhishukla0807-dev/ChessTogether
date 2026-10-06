---
id: "dhcp"
title: "DHCP"
readTime: "3 min"
summary: "Dynamic Host Configuration Protocol automatically provisioning IPs, subnet masks, and gateways."
keyTakeaway: "Cloud providers run internal managed DHCP services that assign private IPs to instances on boot."
---

## 1. DORA Process

- Discover: Client broadcasts to find a DHCP server.
- Offer: Server reserves and offers an IP lease.
- Request: Client requests the offered IP lease.
- Acknowledge: Server confirms the lease assignment.
