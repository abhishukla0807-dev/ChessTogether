---
id: "cloud-networking"
title: "Networking"
readTime: "4 min"
summary: "Virtual Private Clouds (VPCs), public/private subnets, internet gateways, and route tables."
keyTakeaway: "Keep your database subnets completely isolated with zero route table entries to the Internet or NAT."
---

## 1. 3-Tier VPC Architecture

- Public Subnet: Internet-facing Application Load Balancer (ALB) and NAT Gateway.
- Private App Subnet: Application containers/VMs communicating outbound via NAT.
- Isolated DB Subnet: Database instances with zero internet access, reachable only by the app tier.
