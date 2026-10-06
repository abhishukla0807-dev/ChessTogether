---
id: "encryption"
title: "Encryption"
readTime: "4 min"
summary: "Encryption in Transit (TLS) and Encryption at Rest using AES-256 and Key Management Services (KMS)."
keyTakeaway: "Enable default encryption on all cloud S3 buckets, EBS volumes, and database snapshots."
---

## 1. Cryptographic Standards

- In-Transit: TLS 1.2+ with forward secrecy cipher suites.
- At-Rest: AES-256 block cipher managed by AWS KMS, GCP KMS, or HashiCorp Vault.
- Envelope Encryption: Encrypting plaintext with a data key, then encrypting the data key with a master key.
