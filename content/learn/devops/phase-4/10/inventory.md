---
id: "inventory"
title: "Inventory"
readTime: "3 min"
summary: "Defining managed server hosts, groups, and connection variables in INI or YAML files."
keyTakeaway: "Use dynamic inventory plugins to automatically target EC2 instances based on tags like 'Role=web'."
---

## 1. Dynamic Inventories

- Static inventory: Explicit list of server IP addresses.
- Dynamic inventory: Automatically queries cloud APIs (e.g. AWS EC2 plugin) to discover servers by tags.

```
[webservers]
web-01.company.com
web-02.company.com

[dbservers]
db-01.company.com
```
