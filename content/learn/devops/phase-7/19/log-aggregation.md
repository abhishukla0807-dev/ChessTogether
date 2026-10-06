---
id: "log-aggregation"
title: "Log Aggregation"
readTime: "4 min"
summary: "Centralizing distributed logs using the Grafana Loki, Fluent Bit, and ELK (Elasticsearch/Logstash/Kibana) stacks."
keyTakeaway: "The PLG stack (Prometheus, Loki, Grafana) provides an integrated, cost-effective observability suite."
---

## 1. Loki vs Elasticsearch

- Loki: Indexes only metadata labels (like Prometheus), keeping index size tiny and storage costs cheap.
- Fluent Bit: Lightweight C-based daemon running on nodes to collect and forward container logs.
