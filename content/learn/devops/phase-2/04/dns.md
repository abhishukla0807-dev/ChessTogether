---
id: "dns"
title: "DNS"
readTime: "4 min"
summary: "The hierarchical domain naming system mapping human-readable domain names to IP addresses."
keyTakeaway: "Lower DNS TTLs to 60-300 seconds prior to planned infrastructure migrations for fast cutovers."
---

## 1. DNS Record Types

- A Record: Maps hostname to IPv4 address.
- AAAA Record: Maps hostname to IPv6 address.
- CNAME: Canonical name alias pointing one domain to another.
- MX: Mail exchanger records.
- TTL (Time To Live): Determines how long resolvers cache the DNS answer.

```
dig +trace chesskit.org
nslookup api.chesskit.org
```
