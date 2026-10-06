---
id: "providers"
title: "Providers"
readTime: "3 min"
summary: "Plugins that translate Terraform HCL declarations into provider API calls (AWS, Azure, GCP, GitHub, K8s)."
keyTakeaway: "Always pin provider versions to prevent unexpected breaking changes during automated CI runs."
---

## 1. Configuring Providers

- Providers declare the target cloud and authentication credentials.

```
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
```
