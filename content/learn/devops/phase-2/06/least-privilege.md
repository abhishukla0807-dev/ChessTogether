---
id: "least-privilege"
title: "Least Privilege"
readTime: "3 min"
summary: "The principle of granting only the absolute minimum permissions required to perform a task."
keyTakeaway: "Start with zero permissions and grant specific API actions only when explicitly proven necessary."
---

## 1. Implementation

- Avoid wildcard actions (e.g. 'Action': 's3:*').
- Scope permissions to specific Amazon Resource Names (ARNs) rather than all resources.
- Regularly audit unused permissions using Access Analyzer.
