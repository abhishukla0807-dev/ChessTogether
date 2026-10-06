---
id: "runtime-security"
title: "Runtime Security"
readTime: "4 min"
summary: "Detecting malicious activities, kernel exploitation, and privilege escalation in running containers using eBPF."
keyTakeaway: "Deploy Falco to get real-time security alerts when containers perform unauthorized system calls or file access."
---

## 1. eBPF-Based Detection

- Tools: Falco, Cilium Tetragon.
- Monitors system calls in real-time to alert on suspicious behavior (e.g. a shell opened inside a production database pod).
