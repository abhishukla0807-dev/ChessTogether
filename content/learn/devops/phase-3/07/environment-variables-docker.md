---
id: "environment-variables-docker"
title: "Environment Variables"
readTime: "3 min"
summary: "Injecting configuration parameters into containers dynamically at runtime."
keyTakeaway: "Build one immutable Docker image and deploy it across Dev, Staging, and Prod using environment variables."
---

## 1. Runtime Configuration

- Use -e or --env-file to pass key-value variables without rebuilding the image.
- Never bake secrets into Dockerfiles or commit .env files to source control.

```
docker run -d --env-file .env.prod -p 3000:3000 my-app:latest
```
