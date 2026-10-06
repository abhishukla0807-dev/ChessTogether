---
id: "structured-logs"
title: "Structured Logs"
readTime: "3 min"
summary: "Formatting logs as structured JSON rather than unparsed plain text strings."
keyTakeaway: "Always log in structured JSON with trace_id and service fields for instant indexed search."
---

## 1. Why JSON Logs Win

- Log aggregators (Elasticsearch, Loki) index JSON fields automatically without complex regex parsers.
- Enables fast querying: level: 'ERROR' AND user_id: 12345.

```
{"timestamp": "2026-09-13T10:00:00Z", "level": "ERROR", "service": "payment-api", "trace_id": "4bf92f3577b34da6", "message": "Payment gateway timeout", "status_code": 504}
```
