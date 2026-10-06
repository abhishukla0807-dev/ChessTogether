---
id: "bash-scripting"
title: "Bash Scripting"
readTime: "5 min"
summary: "Writing reliable, defensive shell automation scripts for production environments."
keyTakeaway: "Always start production bash scripts with 'set -euo pipefail' to prevent silent failures."
---

## 1. The Unofficial Bash Strict Mode

- set -e: Exit immediately if any command fails.
- set -u: Treat unset variables as errors.
- set -o pipefail: Pipeline exit code is the value of the last failed command.

```
#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="/var/www/app"
echo "Deploying application to ${APP_DIR}..."
```
