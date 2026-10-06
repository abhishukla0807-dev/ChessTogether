---
id: "caching"
title: "Caching"
readTime: "4 min"
summary: "HTTP caching headers (Cache-Control, ETag, Last-Modified) and reverse proxy micro-caching."
keyTakeaway: "Use content hashing in build filenames (e.g. app.a8f9c.js) with max-age=31536000, immutable."
---

## 1. Cache Control Directives

- public: Can be cached by browser, intermediate proxies, and CDNs.
- private: Cached only by the end-user's browser.
- no-cache: Must validate with server via ETag before serving cached copy.
- no-store: Never cache under any circumstance (sensitive financial/auth data).
