---
id: "config-management"
title: "Configuration Management"
readTime: "4 min"
summary: "Maintaining computer systems, servers, and software in a desired, consistent state automatically."
keyTakeaway: "Use Terraform to build the cloud instances; use Ansible or cloud-init to configure software inside them."
---

## 1. IaC vs Configuration Management

- Terraform provisions the infrastructure (creates the VM, VPC, and security group).
- Ansible configures the OS inside the VM (installs Nginx, copies configs, hardens SSH).
