---
id: "volumes"
title: "Volumes"
readTime: "4 min"
summary: "Persisting data beyond the ephemeral lifecycle of a container using Docker Volumes and Bind Mounts."
keyTakeaway: "Never write state or uploaded files inside a container's writable layer; always mount a dedicated volume."
---

## 1. Storage Types

- Volumes: Managed entirely by Docker in /var/lib/docker/volumes/; recommended for production databases.
- Bind Mounts: Directly mounts a specific host folder into the container; ideal for local hot-reloading development.

```
docker run -d -v postgres_data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16
```
