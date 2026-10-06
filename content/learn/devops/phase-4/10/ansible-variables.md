---
id: "ansible-variables"
title: "Variables"
readTime: "3 min"
summary: "Managing configuration values across host vars, group vars, and role defaults."
keyTakeaway: "Keep variable definitions centralized in group_vars to keep playbooks reusable and maintainable."
---

## 1. Variable Precedence

- group_vars: Set parameters common to a cluster of servers.
- host_vars: Override parameters for a specific unique server.
