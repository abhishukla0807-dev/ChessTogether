---
id: "error-handling"
title: "Error Handling"
readTime: "3 min"
summary: "Graceful error detection, defensive programming, and alerting in infrastructure code."
keyTakeaway: "Clear error messages and meaningful exit codes save hours during middle-of-the-night outages."
---

## 1. Robust Error Management

- Catch specific exceptions rather than swallowing generic errors.
- Return standard Unix exit codes: 0 for success, non-zero for distinct failure reasons.
