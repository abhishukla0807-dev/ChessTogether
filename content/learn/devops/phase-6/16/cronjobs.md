---
id: "cronjobs"
title: "CronJobs"
readTime: "3 min"
summary: "Scheduling recurring Jobs based on standard cron syntax directly inside the cluster."
keyTakeaway: "Set 'concurrencyPolicy: Forbid' to prevent duplicate jobs from running if the previous execution is still active."
---

## 1. CronJob Declarations

- Automates periodic tasks (daily database backups, automated report emails).
- Configurable concurrency policies (Allow, Forbid, Replace).

```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
spec:
  schedule: '0 2 * * *'
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:1.0
          restartPolicy: OnFailure
```
