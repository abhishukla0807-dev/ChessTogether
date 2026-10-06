---
id: "tcp-udp"
title: "TCP & UDP"
readTime: "4 min"
summary: "Reliable 3-way handshake transport vs lightweight, connectionless datagram streaming."
keyTakeaway: "TCP guarantees delivery via acknowledgments and retransmissions; UDP prioritizes ultra-low latency."
---

## 1. TCP 3-Way Handshake

- 1. SYN (Client requests connection).
- 2. SYN-ACK (Server acknowledges and responds).
- 3. ACK (Client confirms; connection established).
- TCP provides guaranteed delivery, congestion control, and ordered byte streaming.
- UDP eliminates handshake latency; ideal for DNS queries, video streaming, and VoIP.
