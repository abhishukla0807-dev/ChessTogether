---
id: "processes"
title: "Processes"
readTime: "4 min"
summary: "Process lifecycle, signals, fork-exec model, and resource monitoring."
keyTakeaway: "Always send SIGTERM first to allow applications to flush databases and close open sockets."
---

## 1. Process Inspection

- ps aux: Snapshot of running processes.
- top / htop: Real-time interactive CPU, memory, and thread monitor.
- kill / pkill: Send signals like SIGTERM (15, graceful) and SIGKILL (9, forceful).

```
ps aux | grep nginx
kill -15 <PID>  # Graceful stop
kill -9 <PID>   # Forced termination
```
