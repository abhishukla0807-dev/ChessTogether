---
id: "roles"
title: "Roles"
readTime: "4 min"
summary: "Structuring playbooks into reusable directory layouts (tasks, handlers, templates, files, vars)."
keyTakeaway: "Use Handlers in Ansible roles to ensure services restart only when configuration files actually change."
---

## 1. Standard Role Layout

- tasks/main.yml: Core task definitions.
- handlers/main.yml: Tasks triggered only on change (e.g. restart service after config edit).
- templates/: Jinja2 template files with variable interpolation.
