---
id: "linux-architecture"
title: "Linux Architecture"
readTime: "4 min"
summary: "Kernel space, user space, system calls, and hardware abstraction in GNU/Linux."
keyTakeaway: "Containers are simply isolated user-space processes running on the host Linux kernel via cgroups and namespaces."
---

## 1. Core Layers

- Hardware: CPU, RAM, Network Interfaces, Disks.
- Kernel: Monolithic core managing CPU scheduling, memory, virtual filesystem, and drivers.
- System Calls (syscalls): The API bridge between user space and kernel mode.
- User Space: Daemons, shells, user applications, and utilities.
