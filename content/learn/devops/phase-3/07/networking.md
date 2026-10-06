---
id: "networking"
title: "Networking"
readTime: "4 min"
summary: "Bridge networks, host networking, overlay networks, and DNS service discovery between containers."
keyTakeaway: "Always create a custom user-defined bridge network so containers can address each other by hostname."
---

## 1. Custom Bridge Networks

- Containers on the default bridge can only talk to each other via IP address.
- Containers on user-defined custom bridge networks get automatic DNS resolution by container name.

```
docker network create app-net
docker run -d --net app-net --name db postgres:16
docker run -d --net app-net --name backend my-api
```
