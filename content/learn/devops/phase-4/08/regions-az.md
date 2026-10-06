---
id: "regions-az"
title: "Regions & Availability Zones"
readTime: "4 min"
summary: "Physical geographic distribution of cloud data centers and fault tolerance boundaries."
keyTakeaway: "Always build multi-AZ architectures for critical production databases and web application clusters."
---

## 1. High Availability Architecture

- Region: A distinct geographic location worldwide (e.g. us-east-1 N. Virginia, ap-south-1 Mumbai).
- Availability Zone (AZ): One or more isolated physical data centers within a region, connected via low-latency fiber.
- Deploying across at least 2 or 3 AZs prevents application downtime if a whole data center experiences power failure.
