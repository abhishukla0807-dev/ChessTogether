---
id: "dependency-scanning"
title: "Dependency Scanning"
readTime: "3 min"
summary: "Auditing open-source libraries and transitive dependencies for known CVE vulnerabilities."
keyTakeaway: "Over 80% of application code comes from open-source libraries; automate dependency CVE scanning on every commit."
---

## 1. Automated SCA

- Tools: Snyk, Dependabot, Trivy, npm audit.
- Blocks builds if high-severity Common Vulnerabilities and Exposures (CVEs) exist in third-party packages.
