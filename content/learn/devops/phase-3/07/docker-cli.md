---
id: "docker-cli"
title: "Docker CLI"
readTime: "4 min"
summary: "Essential commands for building, running, inspecting, and managing containers locally."
keyTakeaway: "Use docker system prune -af periodically in CI runners to clean up dangling untagged image layers."
---

## 1. Essential Commands

- docker build -t my-app:1.0 .: Builds an image from the local Dockerfile.
- docker run -d -p 8080:80 --name web my-app:1.0: Runs container in detached mode with port forwarding.
- docker logs -f web: Streams live container stdout/stderr logs.
- docker exec -it web sh: Opens an interactive shell inside a running container.

```
docker ps -a
docker stats
docker system prune -af
```
