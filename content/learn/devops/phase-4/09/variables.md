---
id: "variables"
title: "Variables"
readTime: "3 min"
summary: "Parameterizing Terraform code with input variables, validation rules, and environment values."
keyTakeaway: "Parameterize configurations to reuse the same Terraform code across dev, staging, and production."
---

## 1. Input Variables

- Define type constraints and descriptions for reusability across staging and production.

```
variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "dev"
}
```
