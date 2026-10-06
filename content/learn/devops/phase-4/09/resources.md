---
id: "resources"
title: "Resources"
readTime: "4 min"
summary: "The fundamental building blocks declaring infrastructure components in HCL."
keyTakeaway: "Add consistent tags (Environment, Project, ManagedBy) to every cloud resource for billing attribution."
---

## 1. Resource Declaration

- Format: resource "type" "local_name" { arguments }.

```
resource "aws_s3_bucket" "app_assets" {
  bucket = "my-company-assets-prod"
  tags = {
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}
```
