---
id: "playbooks"
title: "Playbooks"
readTime: "4 min"
summary: "Declarative YAML blueprints defining lists of configuration tasks executed sequentially on target hosts."
keyTakeaway: "Playbooks are declarative and state-driven: they describe how servers should be configured."
---

## 1. Playbook Structure

- Defines target hosts, user escalation, and built-in modules (apt, systemd, copy, template).

```
- name: Configure Nginx Web Server
  hosts: webservers
  become: true
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: latest
    - name: Start Nginx
      systemd:
        name: nginx
        state: started
        enabled: true
```
