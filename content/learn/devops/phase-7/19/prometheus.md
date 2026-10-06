---
id: "prometheus"
title: "Prometheus"
readTime: "5 min"
summary: "Time-series database and monitoring system using a pull-based scraping architecture and PromQL."
keyTakeaway: "Prometheus scrapes /metrics endpoints via pull model; use PromQL to calculate rates, percentiles, and errors."
---

## 1. Pull vs Push Model

- Prometheus actively scrapes HTTP /metrics endpoints from targets at configured intervals (e.g. every 15s).
- Stores data in an optimized multi-dimensional time series format indexed by metric name and key-value labels.

```
# PromQL Example: 99th percentile request latency over 5m
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```
