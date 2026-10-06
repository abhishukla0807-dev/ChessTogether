---
id: "nat"
title: "NAT"
readTime: "3 min"
summary: "Network Address Translation enabling private subnet instances to access the public internet securely."
keyTakeaway: "Deploy NAT Gateways in public subnets so private backend instances can make outbound API calls safely."
---

## 1. Source NAT (SNAT)

- Masks private instance IPs behind a single public elastic IP.
- Allows backend servers to download OS updates and API packages without being exposed to incoming attacks.
