---
id: "images"
title: "Images"
readTime: "4 min"
summary: "Read-only layered templates containing application runtime, code, binaries, and system libraries."
keyTakeaway: "Order Dockerfile commands wisely: copy package.json and install dependencies before copying source code."
---

## 1. Image Layers & Union Filesystems

- Each instruction in a Dockerfile creates an immutable cached layer.
- OverlayFS combines layers into a unified single filesystem view.
- Docker caches layers: order instructions from least frequently changed to most frequently changed.
