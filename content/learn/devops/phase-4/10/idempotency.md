---
id: "idempotency"
title: "Idempotency"
readTime: "3 min"
summary: "The ability to run a configuration task multiple times with the guarantee of identical end results."
keyTakeaway: "A well-written Ansible playbook can be run 10 times in a row with zero changes on runs 2 through 10."
---

## 1. Idempotent Modules

- Built-in modules (apt, file, copy, systemd) check current state before executing.
- If the package is already installed, Ansible reports 'ok' and performs no action.
- Avoid raw shell/command modules which bypass idempotency tracking.
