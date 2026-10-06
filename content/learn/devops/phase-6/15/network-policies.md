---
id: "network-policies"
title: "Network Policies"
readTime: "4 min"
summary: "Packet-level firewall rules controlling traffic flow between Pods and network endpoints."
keyTakeaway: "Implement a default-deny NetworkPolicy and explicitly allow only required traffic between specific tiers."
---

## 1. Zero-Trust Pod Networking

- By default, all Pods in a Kubernetes cluster can communicate with all other Pods without restriction.
- NetworkPolicies enforce explicit ingress and egress whitelist rules using a CNI plugin (Calico, Cilium).
