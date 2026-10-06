---
id: "remote-repositories"
title: "Remote Repositories"
readTime: "3 min"
summary: "Remote tracking branches synchronize distributed peer repositories across teams."
keyTakeaway: "Always fetch before pushing to review incoming remote changes and prevent merge conflicts."
---

## 1. Managing Remotes

- Fetch: Downloads commits, files, and refs without merging into local branches.
- Pull: Executes git fetch followed by git merge FETCH_HEAD.
- Push: Transmits local branch commits to the upstream remote repository.

```
git remote add origin git@github.com:company/infra.git
git fetch origin
git push -u origin main
```
