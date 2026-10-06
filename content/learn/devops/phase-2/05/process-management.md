---
id: "process-management"
title: "Process Management"
readTime: "3 min"
summary: "Supervising application worker processes with systemd, PM2, and supervisor."
keyTakeaway: "Never run applications using bare 'node app.js' or 'python app.py'—always wrap in systemd or PM2."
---

## 1. Auto-Restart on Crash

- Monitors process health and automatically spawns new worker instances if an unhandled error occurs.
- Rotates logs to prevent filling up root disk partitions.
