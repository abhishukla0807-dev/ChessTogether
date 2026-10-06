---
id: "sbom"
title: "SBOM"
readTime: "3 min"
summary: "Software Bill of Materials: A formal, machine-readable inventory of all software components and licenses."
keyTakeaway: "Generate and publish an SBOM with every production release to maintain an audit trail of all third-party components."
---

## 1. Generating SBOMs

- Formats: SPDX, CycloneDX.
- Tools like Syft generate an exact inventory of all packages inside a Docker image for compliance audits.

```
syft my-app:latest -o spdx-json > sbom.spdx.json
```
