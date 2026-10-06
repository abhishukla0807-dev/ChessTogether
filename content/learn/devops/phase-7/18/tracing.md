---
id: "tracing"
title: "Tracing"
readTime: "4 min"
summary: "Tracking the end-to-end lifecycle of a single request across multiple microservices and databases."
keyTakeaway: "Distributed tracing is essential for microservices to pinpoint which downstream service caused a slow p99 latency spike."
---

## 1. Spans and Traces

- Trace: Represents the entire journey of a transaction through a distributed system.
- Span: A single named, timed operation (e.g. an SQL query or Redis GET) within a trace.
- Reveals the exact microservice causing slow latency bottlenecks.
