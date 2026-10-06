---
id: "package"
title: "Package"
readTime: "3 min"
summary: "Creating immutable build outputs: Docker images, JARs, wheels, and tarballs."
keyTakeaway: "Build your container image once; promote that exact immutable image through all environments."
---

## 1. Golden Artifacts

- Build an artifact once, test it, and promote that exact same artifact through staging to production.
- Never rebuild code for production with different compiler flags or environments.
