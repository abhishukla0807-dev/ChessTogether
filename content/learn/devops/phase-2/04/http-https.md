---
id: "http-https"
title: "HTTP/HTTPS"
readTime: "4 min"
summary: "Stateless request-response web protocol, REST conventions, headers, and status code families."
keyTakeaway: "502 Bad Gateway indicates your reverse proxy cannot reach the upstream backend application."
---

## 1. Status Code Families

- 2xx: Success (200 OK, 201 Created, 204 No Content).
- 3xx: Redirection (301 Permanent, 302 Temporary, 304 Not Modified).
- 4xx: Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found).
- 5xx: Server Errors (500 Internal, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).
