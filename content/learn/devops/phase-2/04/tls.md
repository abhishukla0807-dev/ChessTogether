---
id: "tls"
title: "TLS"
readTime: "4 min"
summary: "Transport Layer Security providing confidentiality, data integrity, and server authentication via PKI."
keyTakeaway: "Always terminate TLS at your load balancer or reverse proxy to offload CPU-intensive handshakes."
---

## 1. TLS Handshake

- Client and server negotiate cipher suites and exchange cryptographic keys using asymmetric encryption.
- Once keys are agreed upon, high-speed symmetric AES-GCM encryption secures payload data.
- Automate certificate renewal using Let's Encrypt and certbot.
