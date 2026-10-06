---
id: "code-review-practices"
title: "Code Review"
readTime: "3 min"
summary: "Peer review cultural norms, small diff sizes, and automated status checks."
keyTakeaway: "Automate style and formatting checks in CI so human peer reviews can focus on architectural correctness."
---

## 1. High-Impact Reviews

- Focus on architecture, potential race conditions, security, and edge-case handling.
- Let automated linters handle code formatting and syntax checks so humans can focus on design.
