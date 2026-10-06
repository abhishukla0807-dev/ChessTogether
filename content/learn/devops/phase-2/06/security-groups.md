---
id: "security-groups"
title: "Security Groups / Firewalls"
readTime: "3 min"
summary: "Virtual firewalls controlling inbound and outbound traffic at the cloud instance level."
keyTakeaway: "Allow database ports (e.g. 5432) ONLY from the web tier's security group, never from 0.0.0.0/0."
---

## 1. Stateful Filtering

- Security groups are stateful: if inbound traffic is permitted on port 443, outbound response is automatically allowed.
- Reference other security groups as sources rather than hardcoding IP ranges.
