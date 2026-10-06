---
id: "ansible-secrets"
title: "Secrets"
readTime: "3 min"
summary: "Encrypting sensitive variables, private keys, and passwords using Ansible Vault."
keyTakeaway: "Use Ansible Vault to safely commit encrypted application secrets directly into version control."
---

## 1. Ansible Vault Commands

- ansible-vault encrypt: Encrypts files using AES-256.
- ansible-vault decrypt / view: Decrypts or inspects encrypted content with password.

```
ansible-vault create vars/vault.yml
ansible-playbook site.yml --ask-vault-pass
```
