---
id: "dockerfile"
title: "Dockerfile"
readTime: "4 min"
summary: "Declarative recipe for building container images using standard instructions."
keyTakeaway: "Always run as a non-root user (e.g. USER node) to prevent container breakout exploits."
---

## 1. Core Instructions

- FROM: Defines base image (e.g. alpine, node:20-slim, eclipse-temurin:21).
- WORKDIR: Sets active working directory inside the container.
- COPY vs ADD: Use COPY for local files; ADD is reserved for remote URLs and auto-tar extraction.
- ENTRYPOINT vs CMD: ENTRYPOINT defines the immutable executable; CMD provides default arguments.

```
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```
