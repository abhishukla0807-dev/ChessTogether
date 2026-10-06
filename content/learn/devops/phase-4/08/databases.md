---
id: "databases"
title: "Databases"
readTime: "4 min"
summary: "Managed relational (RDS/Aurora) and NoSQL (DynamoDB) databases in cloud architectures."
keyTakeaway: "Never run production stateful databases on bare EC2 instances if managed RDS/Aurora is available."
---

## 1. Benefits of Managed DBs

- Automated daily backups, point-in-time recovery, and security patch updates.
- Multi-AZ synchronous replication for automatic failover within 60 seconds.
- Read replicas for offloading heavy read queries from the primary database.
