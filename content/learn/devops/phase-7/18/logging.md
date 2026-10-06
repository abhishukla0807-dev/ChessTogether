---
id: "logging"
title: "Logging"
readTime: "4 min"
summary: "Capturing timestamped, contextual event records across distributed applications."
keyTakeaway: "Applications in containers should log to stdout/stderr; let cluster logging daemons collect and ship them."
---

## 1. Logging Best Practices

- Output all logs to stdout and stderr (container standard).
- Include correlation IDs / request IDs to trace a request across microservices.
- Avoid logging sensitive Personally Identifiable Information (PII) or secrets.
