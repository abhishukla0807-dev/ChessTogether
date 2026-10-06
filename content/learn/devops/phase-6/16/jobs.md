---
id: "jobs"
title: "Jobs"
readTime: "3 min"
summary: "Running batch tasks that execute to completion and terminate successfully."
keyTakeaway: "Use Kubernetes Jobs in CI/CD pipelines to run database schema migrations before updating deployments."
---

## 1. Job Mechanics

- Unlike Deployments which keep pods running forever, a Job ensures pods run until exit code 0.
- Ideal for database schema migrations, batch image processing, and report generation.
