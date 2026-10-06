---
id: "test"
title: "Test"
readTime: "4 min"
summary: "Automated testing pyramid: Unit, Integration, Contract, and End-to-End tests in CI."
keyTakeaway: "Keep unit test suites blazing fast; use ephemeral Docker testcontainers for database integration tests."
---

## 1. Test Pyramid

- Unit Tests (70%): Fast, isolated, in-memory tests mocking external systems.
- Integration Tests (20%): Verify interactions with real databases and caches using testcontainers.
- E2E Tests (10%): High-level sanity checks testing critical user workflows.
