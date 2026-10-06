---
id: "container-lifecycle"
title: "Container Lifecycle"
readTime: "3 min"
summary: "States of a container: Created, Running, Paused, Stopped, and Exited."
keyTakeaway: "Ensure your application handles SIGTERM to cleanly close active HTTP connections and database transactions."
---

## 1. Process Lifecycle

- A container only lives as long as its PID 1 process is running.
- When PID 1 exits, the container transitions to Exited status.
- Docker sends SIGTERM, waits a grace period (default 10s), then sends SIGKILL.
