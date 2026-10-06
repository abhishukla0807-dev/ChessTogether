---
id: "distributed-systems-basics"
title: "Distributed Systems Basics"
readTime: "4 min"
summary: "The CAP Theorem, PACELC, network partitions, and eventual consistency in cloud systems."
keyTakeaway: "You cannot eliminate network partitions in the cloud; design systems that handle eventual consistency gracefully."
---

## 1. The CAP Theorem

- Consistency: Every read receives the most recent write.
- Availability: Every request receives a non-error response.
- Partition Tolerance: The system continues to operate despite network drops between nodes.
- In a distributed system, network partitions (P) are inevitable; you must choose between Consistency (CP) or Availability (AP).
