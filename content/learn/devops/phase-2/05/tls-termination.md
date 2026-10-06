---
id: "tls-termination"
title: "TLS Termination"
readTime: "3 min"
summary: "Decrypting HTTPS traffic at the reverse proxy boundary to simplify backend services."
keyTakeaway: "TLS termination centralizes certificate renewal and reduces CPU overhead on backend servers."
---

## 1. Architecture

- Edge / Load Balancer terminates TLS using the SSL certificate.
- Traffic to backend instances travels unencrypted over the isolated private cloud VPC network.
