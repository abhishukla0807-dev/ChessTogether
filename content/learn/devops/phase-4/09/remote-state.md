---
id: "remote-state"
title: "Remote State"
readTime: "4 min"
summary: "Storing state files centrally in Amazon S3 with DynamoDB state locking to prevent race conditions."
keyTakeaway: "Never store state files in local Git repos—always configure encrypted remote state with state locking."
---

## 1. S3 + DynamoDB Backend

- Enables team collaboration: prevents multiple engineers or CI pipelines from modifying state concurrently.
- DynamoDB acquires an exclusive lock during 'terraform plan/apply'.

```
terraform {
  backend "s3" {
    bucket         = "company-tf-state"
    key            = "prod/network.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-state-locks"
    encrypt        = true
  }
}
```
