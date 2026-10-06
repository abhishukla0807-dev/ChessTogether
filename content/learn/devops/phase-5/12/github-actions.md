---
id: "github-actions"
title: "GitHub Actions"
readTime: "5 min"
summary: "Modern cloud-native CI/CD platform integrated natively into GitHub repositories."
keyTakeaway: "GitHub Actions is the modern standard for cloud-native CI/CD thanks to tight Git integration and rich marketplace actions."
---

## 1. Workflow Anatomy

- Defined in .github/workflows/*.yml.
- Events (push, pull_request) trigger Jobs consisting of sequential Steps running on GitHub-hosted or self-hosted runners.
- Marketplace ecosystem of community actions (actions/checkout, docker/build-push-action).

```
name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```
