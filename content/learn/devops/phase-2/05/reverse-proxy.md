---
id: "reverse-proxy"
title: "Reverse Proxy"
readTime: "4 min"
summary: "Routing public client requests to internal upstream application services."
keyTakeaway: "Always pass X-Forwarded-For and Host headers so backend applications preserve client metadata."
---

## 1. Nginx Reverse Proxy Configuration

- Hides backend server topology and IP addresses from the public internet.
- Provides central location for rate limiting, SSL termination, and header sanitization.

```
server {
    listen 80;
    server_name api.company.com;
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
