---
id: "alerting-stack"
title: "Alerting"
readTime: "4 min"
summary: "Prometheus Alertmanager: deduplication, grouping, silencing, and routing alerts to PagerDuty/Slack."
keyTakeaway: "Alertmanager prevents notification storms by grouping related alerts into a single notification."
---

## 1. Alertmanager Features

- Grouping: Condenses multiple related firing alerts into a single notification.
- Inhibition: Suppresses downstream alerts if a critical upstream parent alert is already firing.
- Silencing: Temporarily mutes alerts during scheduled maintenance windows.
