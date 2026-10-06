---
id: "services"
title: "Services"
readTime: "4 min"
summary: "Managing background daemons and service lifecycles with systemd and journalctl."
keyTakeaway: "Use systemctl for service control and journalctl -u <service> -f for live log streaming."
---

## 1. Systemd Service Management

- systemd is the standard PID 1 init system on modern Linux distributions.
- Unit files located in /etc/systemd/system/ define restart policies, dependencies, and environment variables.

```
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
journalctl -u nginx -f --no-tail
```
