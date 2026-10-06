---
id: "metrics"
title: "Metrics"
readTime: "4 min"
summary: "Aggregatable numeric measurements sampled over time: counters, gauges, and histograms."
keyTakeaway: "Metrics are numerically cheap to store and alert on; use metrics for alerts and logs for deep investigation."
---

## 1. Metric Types

- Counter: Monotonically increasing value that only goes up or resets to zero (e.g. total HTTP requests).
- Gauge: Numerical value that fluctuates up and down (e.g. active memory usage, current thread count).
- Histogram: Samples observations into configurable buckets (e.g. request duration latency).
