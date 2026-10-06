---
id: "terraform"
title: "Terraform"
readTime: "4 min"
summary: "HashiCorp Terraform architecture, HCL syntax, execution workflow (init, plan, apply, destroy)."
keyTakeaway: "Always run 'terraform plan' and inspect the proposed diff carefully before running apply in production."
---

## 1. Core Workflow

- terraform init: Downloads providers and modules.
- terraform plan: Generates an execution plan showing resources to add, modify, or destroy.
- terraform apply: Executes the proposed changes against cloud APIs.
- terraform destroy: Tears down all resources managed by the state file.
