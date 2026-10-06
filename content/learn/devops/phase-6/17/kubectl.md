---
id: "kubectl"
title: "kubectl"
readTime: "4 min"
summary: "The official command-line interface for communicating with the Kubernetes cluster API server."
keyTakeaway: "Always check 'kubectl describe' when a pod is stuck in CrashLoopBackOff or Pending state."
---

## 1. Essential kubectl Commands

- kubectl get pods -A: View all pods across all namespaces.
- kubectl describe pod <name>: Inspect events, scheduling reasons, and failure states.
- kubectl logs -f <pod-name> -c <container>: Stream container logs.
- kubectl exec -it <pod-name> -- sh: Open an interactive shell inside a container.
