---
id: "iam-concepts"
title: "IAM Concepts"
readTime: "4 min"
summary: "Identity and Access Management: Users, Groups, Roles, Policies, and Credential Governance."
keyTakeaway: "Never issue static access keys to EC2 instances or pods—assign IAM Roles with temporary credentials."
---

## 1. Core IAM Primitives

- User: Permanent identity assigned to a specific human or service.
- Role: Assumable identity providing temporary, auto-expiring security credentials.
- Policy: JSON document defining explicit Allow and Deny permissions on resources.
