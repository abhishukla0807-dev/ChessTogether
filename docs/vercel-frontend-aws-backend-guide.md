# 🚀 Full Guide: Frontend on Vercel + Backend on AWS EC2 (t3.micro)

This architecture provides the **ultimate balance of performance, cost (100% Free), and reliability**:
- **Frontend on Vercel**: Supersonic Global Edge CDN, automated builds on every `git push`, automatic HTTPS.
- **Backend on AWS EC2 `t3.micro`**: Dedicated Spring Boot 4.1.1 REST API + Netty Socket.IO persistent WebSocket server running safely within ~300MB RAM.

---

```
  [ Users Worldwide ]
           │
           ├──────────────────────────────┐
           ▼ (HTTPS)                      ▼ (WSS / WebSocket)
   [ Vercel Edge CDN ]             [ AWS EC2 t3.micro ]
    Next.js 16 Frontend              Nginx (Port 80/443)
           │                               │
           ▼ (Internal Proxy)              ├─► Spring Boot (Port 8080)
           └───────────────────────────────┴─► Netty Socket.IO (Port 9092)
```

---

## 📦 Part 1: Deploy Backend on AWS EC2 (t3.micro)

### 1. Launch EC2 Instance (AWS Console)
1. Go to **[AWS EC2 Console](https://console.aws.amazon.com/ec2/)** ➔ **Launch Instance**.
2. **Name**: `chess-backend`
3. **AMI**: **Ubuntu 24.04 LTS** (Free Tier eligible).
4. **Instance Type**: **`t3.micro`** (2 vCPUs, 1 GB RAM).
5. **Key Pair**: Download a `.pem` key (e.g., `chess-key.pem`).
6. **Network Settings (Security Group)**: Allow these Inbound Rules:
   - **SSH (22)**: My IP (or `0.0.0.0/0`)
   - **HTTP (80)**: `0.0.0.0/0`
   - **HTTPS (443)**: `0.0.0.0/0`
7. Click **Launch Instance** and copy your **Public IPv4 address** (e.g., `13.233.50.80`).

---

### 2. Run the 1-Command Backend Setup Script

SSH into your EC2 instance from PowerShell / Terminal:
```bash
ssh -i .\chess-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Run these commands inside your EC2 terminal:
```bash
# 1. Clone your repo
git clone https://github.com/<YOUR_GITHUB_USERNAME>/ChessTogether.git
cd ChessTogether/ChessTogether-main

# 2. Run automated backend deployment
sudo bash deploy-backend.sh
```

### What this does:
- Configures 2GB Swap Space (smooth Java memory management).
- Installs Docker & Docker Compose.
- Starts **Spring Boot 4.1.1** (REST on 8080) and **Netty-SocketIO** (WebSocket on 9092).
- Configures **Nginx** on Port 80 to proxy `/api/` and `/api/socket_io/`.

Verify backend is healthy:
```bash
curl http://localhost/health
# Output: OK
```

---

## ⚡ Part 2: Deploy Frontend on Vercel

1. Open **[vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **Add New** ➔ **Project** and select your `ChessTogether` repository.
3. In **Project Settings**:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `ChessTogether-main` (or `./` if your repo root is the Next.js app)
4. Open the **Environment Variables** tab and add these 2 variables:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `BACKEND_URL` | `https://chesstogether-abhi.duckdns.org` | Used by Next.js server-side rewrites |
| `NEXT_PUBLIC_SOCKET_URL` | `https://chesstogether-abhi.duckdns.org` | Client WebSocket endpoint (WSS) |

5. Click **Deploy**! 🚀
In ~60 seconds, Vercel will give you a live domain like `https://chesstogether.vercel.app`.

---

## 🔒 Part 3: Active SSL Setup

Backend is live on:
- **IP**: `13.126.89.91`
- **Domain**: `https://chesstogether-abhi.duckdns.org`
- **SSL**: Active (Let's Encrypt Certbot + Nginx reverse proxy)
- **WebSockets**: `wss://chesstogether-abhi.duckdns.org/api/socket_io`

### Option B: Free Cloudflare Proxy

If you own a custom domain (e.g. `yourname.com`):
1. In Cloudflare DNS, add an `A` record:
   - `api.yourname.com` ➔ `<YOUR_EC2_PUBLIC_IP>` (Proxy status: **Orange cloud / Proxied**).
2. Cloudflare automatically provides free SSL and WebSocket support!
3. On Vercel, set:
   - `BACKEND_URL` = `https://api.yourname.com`
   - `NEXT_PUBLIC_SOCKET_URL` = `https://api.yourname.com`

---

## 🛠️ Management & Maintenance

### Check Backend Logs on EC2:
```bash
# Real-time backend logs
docker compose -f docker-compose.backend.yml logs -f backend

# Nginx logs
docker compose -f docker-compose.backend.yml logs -f nginx
```

### Update Backend when Code Changes:
```bash
git pull
docker compose -f docker-compose.backend.yml up -d --build
```
*(Frontend updates automatically on Vercel on every GitHub push!)*
