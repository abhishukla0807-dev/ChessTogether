---
id: "cloud-iam"
title: "IAM"
readTime: "4 min"
summary: "Cloud access control, credential rotation, service roles, and security policies."
keyTakeaway: "Isolate environments into separate cloud accounts (Dev account vs Prod account) to prevent blast radius overlap."
---

## 1. IAM Security Rules

- Root Account: Lock with physical hardware MFA; never generate access keys for the root account.
- Cross-Account Access: Use AWS Organizations and IAM AssumeRole for multi-account environments (Dev, Staging, Prod).
