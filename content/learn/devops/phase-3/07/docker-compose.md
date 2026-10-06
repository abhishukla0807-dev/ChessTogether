---
id: "docker-compose"
title: "Docker Compose"
readTime: "4 min"
summary: "Declarative multi-container application orchestration tool for local development environments."
keyTakeaway: "Use 'docker compose up -d' for one-click developer onboarding and reproducible integration tests."
---

## 1. Compose File Anatomy

- Defines services, networks, volumes, ports, and environment variables in a single docker-compose.yml file.
- Brings up the entire local tech stack (Frontend, Backend, Postgres, Redis) with a single command.

```
version: '3.8'
services:
  web:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      - db
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```
