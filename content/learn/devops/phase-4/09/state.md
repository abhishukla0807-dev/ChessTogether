---
id: "state"
title: "State"
readTime: "4 min"
summary: "terraform.tfstate: The single source of truth mapping your code to real-world cloud resources."
keyTakeaway: "Treat your state file with extreme care; if it is deleted or corrupted, Terraform loses track of real resources."
---

## 1. Why State is Critical

- Terraform uses state to determine what resources exist, track metadata, and calculate resource deltas.
- Never edit the terraform.tfstate JSON file manually.
