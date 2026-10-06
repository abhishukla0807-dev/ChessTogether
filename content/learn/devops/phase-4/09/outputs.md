---
id: "outputs"
title: "Outputs"
readTime: "3 min"
summary: "Extracting provisioned resource attributes (VPC IDs, Load Balancer DNS, IP addresses)."
keyTakeaway: "Use outputs to export essential connection strings and DNS names to your application pipelines."
---

## 1. Exposing Attributes

- Outputs feed values to downstream modules or CI/CD pipelines.

```
output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "Public DNS address of the load balancer"
}
```
