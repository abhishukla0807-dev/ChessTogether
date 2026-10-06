---
id: "database-migration-strategies"
title: "Database Migration Strategies"
readTime: "5 min"
summary: "The Expand and Contract pattern for non-breaking zero-downtime database schema changes."
keyTakeaway: "Never rename or drop database columns in a single deployment; always use multi-phase Expand and Contract."
---

## 1. The Expand & Contract Pattern

- Step 1 (Expand): Add new column, support both old and new columns in application code.
- Step 2: Backfill existing database rows asynchronously.
- Step 3: Update application code to read and write exclusively from the new column.
- Step 4 (Contract): Safely drop the old column in a subsequent release.
