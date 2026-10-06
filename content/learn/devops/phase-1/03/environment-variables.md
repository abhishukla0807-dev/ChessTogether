---
id: "environment-variables"
title: "Environment Variables"
readTime: "3 min"
summary: "Configuring process environment, PATH resolution, and persistent profiles."
keyTakeaway: "Follow Twelve-Factor App methodology: store all application configuration in environment variables."
---

## 1. Env Mechanics

- Exporting: Makes variables available to child processes.
- PATH: Colon-separated list of directories searched for executable binaries.
- Profile files: /etc/environment, ~/.bashrc, ~/.profile.

```
export DATABASE_URL="postgres://user:pass@localhost:5432/app"
echo $PATH
env
```
