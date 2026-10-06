---
id: "iac-concepts"
title: "IaC Concepts"
readTime: "4 min"
summary: "Treating infrastructure provisioning like software code: versioned, reviewed, automated, and repeatable."
keyTakeaway: "Declarative IaC prevents configuration drift and allows automated plans before making live changes."
---

## 1. Declarative vs Imperative

- Imperative (Bash, AWS CLI): Step-by-step commands describing HOW to build infrastructure.
- Declarative (Terraform, CloudFormation): Describes WHAT the desired end-state should be; the tool calculates the delta.
