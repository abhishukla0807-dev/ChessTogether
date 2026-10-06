---
id: "supply-chain-security"
title: "Software Supply Chain Security"
readTime: "4 min"
summary: "Defending against malicious package tampering, dependency hijacking, and compromised build systems."
keyTakeaway: "Verify checksum hashes for all downloaded dependencies and lock package versions strictly."
---

## 1. Attack Vectors

- Typosquatting: Malicious packages with names similar to popular libraries (e.g. lodash-utils).
- Enforce SLSA (Supply-chain Levels for Software Artifacts) framework compliance.
