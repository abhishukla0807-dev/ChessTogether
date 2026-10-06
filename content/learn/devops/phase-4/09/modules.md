---
id: "modules"
title: "Modules"
readTime: "4 min"
summary: "Packaging reusable, self-contained sets of Terraform configurations into shareable components."
keyTakeaway: "Use community modules (like terraform-aws-modules) for standard patterns instead of reinventing the wheel."
---

## 1. Module Structure

- Encapsulates complex setups (e.g. 3-tier VPC with subnets and NAT gateways) into a reusable block.
- Enforces security standards and best practices across an entire engineering organization.

```
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"
  name    = "prod-vpc"
  cidr    = "10.0.0.0/16"
}
```
