---
id: "workspaces"
title: "Workspaces"
readTime: "3 min"
summary: "Isolating multiple state files within the same configuration directory for testing variations."
keyTakeaway: "Use workspaces for ephemeral preview environments, but use separate cloud accounts for staging and prod."
---

## 1. Workspace Usage

- Enables quick branch testing: 'terraform workspace new feature-test'.
- Note: Separate directories or AWS accounts are preferred for strict prod vs dev isolation.
