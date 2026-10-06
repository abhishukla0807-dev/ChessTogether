---
id: "daemonsets"
title: "DaemonSets"
readTime: "3 min"
summary: "Ensuring that all (or some) worker nodes run exactly one copy of a specified Pod."
keyTakeaway: "DaemonSets are the standard pattern for node-level infrastructure agents like log collectors and monitoring exporters."
---

## 1. DaemonSet Use Cases

- Cluster storage daemons (Ceph, GlusterFS).
- Log collection agents (Fluentd, Logstash running on every node).
- Node monitoring agents (Prometheus Node Exporter, Datadog agent).
