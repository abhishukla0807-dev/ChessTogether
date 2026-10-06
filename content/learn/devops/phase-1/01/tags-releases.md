---
id: "tags-releases"
title: "Tags & Releases"
readTime: "3 min"
summary: "Tags create immutable reference points in history for semantic versioning and build artifacts."
keyTakeaway: "Use annotated SemVer tags to trigger automated release pipelines and build immutable Docker images."
---

## 1. Semantic Versioning (SemVer)

- Format: MAJOR.MINOR.PATCH (e.g. v2.4.1).
- MAJOR: Incompatible API or architectural changes.
- MINOR: Backwards-compatible new functionality.
- PATCH: Backwards-compatible bug fixes.

```
git tag -a v1.2.0 -m 'Release version 1.2.0 with Docker multi-stage builds'
git push origin v1.2.0
```
