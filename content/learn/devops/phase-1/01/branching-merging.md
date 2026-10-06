---
id: "branching-merging"
title: "Branching & Merging"
readTime: "4 min"
summary: "Branches are lightweight pointers to commits. Merging integrates disparate lines of development."
keyTakeaway: "Keep trunk/main clean; use feature branches with rebase or squash-merge for linear histories."
---

## 1. Branch Mechanics

- Creating a branch creates a 41-byte reference file pointing to a commit hash.
- HEAD points to the currently active branch or detached commit.

```
git checkout -b feature/terraform-vpc
# or modern syntax:
git switch -c feature/terraform-vpc
```

## 2. Fast-Forward vs Three-Way Merge

- Fast-Forward: Directly advances pointer when target has no diverging commits.
- 3-Way Merge: Combines two branch tips with their common ancestor into a new merge commit.
- Rebase: Replays commits on top of another base commit for a linear history.

```
git merge --no-ff feature/terraform-vpc
git rebase main
```
