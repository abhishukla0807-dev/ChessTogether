---
id: "permissions"
title: "Permissions"
readTime: "4 min"
summary: "Discretionary Access Control: read, write, execute permissions, and special bits."
keyTakeaway: "SSH private keys must be 600; directories need execute (+x) permission to be traversed."
---

## 1. Permission Modes

- Classes: User (u), Group (g), Others (o).
- Bits: Read (4), Write (2), Execute (1).
- Octal notation: 755 (rwxr-xr-x), 644 (rw-r--r--), 600 (rw------- for private keys).
- Special bits: SUID, SGID, and Sticky Bit (used in /tmp).

```
chmod 600 ~/.ssh/id_ed25519
chmod 755 /usr/local/bin/deploy.sh
chown -R www-data:www-data /var/www/html
```
