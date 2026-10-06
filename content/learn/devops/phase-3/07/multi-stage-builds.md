---
id: "multi-stage-builds"
title: "Multi-stage Builds"
readTime: "4 min"
summary: "Splitting build-time tooling from runtime artifacts to produce tiny, secure production images."
keyTakeaway: "Multi-stage builds dramatically reduce attack surface and download times by stripping out build tools."
---

## 1. Why Multi-Stage Builds Matter

- First stage: Installs compilers (Go, Maven, Node devDependencies) and builds the binary.
- Final stage: Copies only the compiled binary into a minimal distroless or Alpine base image.
- Reduces image size from 1.2 GB down to 25 MB and eliminates build tools from attack surfaces.

```
# Build stage
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o server .

# Final runtime stage
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/server .
CMD ["./server"]
```
