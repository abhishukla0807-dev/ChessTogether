---
id: "infrastructure-provisioning"
title: "Infrastructure Provisioning"
readTime: "4 min"
summary: "Automating Terraform deployments through CI/CD pipelines (Atlantis, GitHub Actions, Terraform Cloud)."
keyTakeaway: "Never run 'terraform apply' manually from personal laptops; run all provisioning through CI/CD pipelines."
---

## 1. GitOps for IaC

- PR open: Automatically runs 'terraform plan' and posts the diff as a PR comment.
- PR merged: Automatically runs 'terraform apply' from the main branch.
- Enforces peer review for every infrastructure change.
