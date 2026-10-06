---
id: "static-content"
title: "Static Content"
readTime: "3 min"
summary: "Optimizing the delivery of HTML, CSS, JavaScript bundles, and images via edge servers and CDNs."
keyTakeaway: "Never serve static assets from Node.js, Python, or Java backends—use Nginx or a CDN like Cloudflare."
---

## 1. Fast Static Serving

- Nginx uses the sendfile syscall to stream files directly from disk to network socket, bypassing user space.

```
location /static/ {
    alias /var/www/static/;
    expires 30d;
    add_header Cache-Control 'public, max-age=2592000';
}
```
