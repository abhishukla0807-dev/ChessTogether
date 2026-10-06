---
id: "deployments"
title: "Deployments"
readTime: "4 min"
summary: "Declarative controller managing stateless Pod replicas, rolling updates, and rollbacks."
keyTakeaway: "Use Deployments for all stateless web applications, APIs, and background queue workers."
---

## 1. Deployment Manifest

- Manages underlying ReplicaSets automatically.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: my-registry/api:v1.0.0
        ports:
        - containerPort: 8080
```
