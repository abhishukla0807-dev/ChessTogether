---
id: "git-fundamentals"
title: "Git Fundamentals"
readTime: "3 min"
summary: "Git is a distributed version control system tracking file changes and enabling collaborative software engineering."
keyTakeaway: "Git is distributed and stores snapshots, not diffs, forming a Directed Acyclic Graph (DAG)."
---

## 1. Three Trees of Git

- Working Directory: Untracked and tracked local files actively being modified.
- Staging Area (Index): Snapshot preparation area before committing.
- Repository (Git Directory): Permanent history of committed snapshots (.git).

```
git init
git add .
git commit -m 'feat: initial infrastructure config'
```

## 2. The Commit Object

- Each commit has a cryptographic SHA-1 hash, author, committer, timestamp, and parent pointer.
- Git snapshots whole directory states rather than recording file diffs.
