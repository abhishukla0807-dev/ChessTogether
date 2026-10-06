---
id: "pipeline-architecture"
title: "Pipeline Architecture"
readTime: "4 min"
summary: "Anatomy of modern delivery pipelines: triggers, stages, jobs, runners, and artifacts."
keyTakeaway: "Fail fast: place fast static linting tests at the beginning of your pipeline to save time and compute costs."
---

## 1. Pipeline Stages

- Stage 1: Lint & Static Analysis (fast feedback in < 2 mins).
- Stage 2: Unit & Integration Tests.
- Stage 3: Build & Package (Docker images).
- Stage 4: Security Scans (SAST & container vulnerabilities).
- Stage 5: Deploy to Staging -> Integration Tests -> Deploy to Production.
