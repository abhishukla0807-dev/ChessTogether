---
id: "rollbacks"
title: "Rollbacks"
readTime: "4 min"
summary: "Instantly reverting to the previously working build artifact if post-deployment health checks fail."
keyTakeaway: "A deployment strategy is only as good as its rollback plan; test your rollback procedure regularly."
---

## 1. Rapid Recovery

- Fastest rollback is re-pointing traffic to the previous known-good immutable Docker image.
- Always design database schema migrations to be backwards-compatible to allow safe code rollbacks.
