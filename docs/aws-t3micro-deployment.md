# 🚀 Deploying ChessTogether on AWS EC2 (t3.micro - Free Tier)

This guide covers everything needed to deploy and run **ChessTogether** (Next.js 16 + Java 21 Spring Boot + Netty Socket.IO + Nginx) on an **AWS EC2 `t3.micro`** instance within the **AWS Free Tier**.

---

## ⚡ The Challenge & How We Solved It
`t3.micro` has **1 GB RAM** and **2 vCPUs**. Running both Java Spring Boot, Next.js, and Nginx together on 1 GB can easily cause Linux **OOM (Out-Of-Memory)** crashes unless tuned properly.

### Our Optimizations:
1. **4 GB Swap Space**: Configured automatically by `deploy-aws.sh` to provide plenty of virtual memory buffer.
2. **Java JVM Tuning**: Uses `-XX:+UseSerialGC -Xms128m -Xmx280m` (SerialGC saves ~40MB overhead on low-core instances).
3. **Node.js Memory Capping**: Configured with `--max-old-space-size=256` to prevent memory leaks.
4. **Unified Nginx Reverse Proxy**: Single entrypoint on Port 80 (HTTP) that routes:
   - `/` ➔ Next.js (port 3000)
   - `/api/` ➔ Spring Boot (port 8080)
   - `/api/socket_io/` ➔ Netty-SocketIO (port 9092) with WebSocket headers.

---

## 📋 Step 1: Launch EC2 Instance in AWS Console

1. Log into your [AWS Management Console](https://console.aws.amazon.com/ec2/).
2. Click **Launch Instance**.
3. **Name**: `ChessTogether-Server`
4. **OS (AMI)**: Select **Ubuntu** (Ubuntu Server 24.04 LTS or 22.04 LTS - Free Tier eligible).
5. **Instance Type**: Select **t3.micro** (or `t2.micro` depending on your region's Free Tier).
6. **Key Pair**:
   - Create a new key pair or select an existing one (e.g. `chess-key.pem`).
   - Download the `.pem` file to your computer.
7. **Network Settings (Security Group)**:
   Ensure the following Inbound Rules are allowed:
   | Type | Port | Protocol | Source | Description |
   | :--- | :--- | :--- | :--- | :--- |
   | **SSH** | `22` | TCP | My IP (or `0.0.0.0/0`) | Remote SSH terminal access |
   | **HTTP** | `80` | TCP | `0.0.0.0/0` | Web traffic (Nginx) |
   | **HTTPS** | `443` | TCP | `0.0.0.0/0` | Secure SSL traffic |
8. **Storage**: Keep default **8 GB to 20 GB gp3** (Free Tier allows up to 30 GB EBS).
9. Click **Launch Instance**.

---

## 🔑 Step 2: Connect to your EC2 Instance via SSH

Open PowerShell / Terminal on your local machine:

```bash
# On Linux / macOS / Git Bash:
chmod 400 chess-key.pem
ssh -i chess-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>

# On Windows PowerShell:
ssh -i .\chess-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

---

## 🚀 Step 3: Clone Repo & Run One-Command Setup

Once inside the EC2 terminal, run:

```bash
# 1. Clone your repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/ChessTogether.git
cd ChessTogether/ChessTogether-main

# 2. Run the automated deployment script
sudo bash deploy-aws.sh
```

### What `deploy-aws.sh` does automatically:
1. Creates and mounts a **4GB Swap File** (`/swapfile`).
2. Installs **Docker** and **Docker Compose plugin**.
3. Configures **UFW Firewall** for ports 22, 80, and 443.
4. Builds the Docker images with memory constraints.
5. Boots all 3 containers (`backend`, `frontend`, `nginx`) in the background.

---

## 🌐 Step 4: Access Your App

Open your browser and visit:
```
http://<YOUR_EC2_PUBLIC_IP>
```
To play chess:
```
http://<YOUR_EC2_PUBLIC_IP>/play
```

Everything (Next.js, Spring Boot, Netty Socket.IO WebSocket) works through port 80 without needing any custom port numbers!

---

## 🔒 Step 5: (Optional) Free Domain & HTTPS / SSL

To get free HTTPS using Let's Encrypt and Certbot:

```bash
# 1. Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 2. Point your domain (e.g., yourname.duckdns.org or custom domain) to <YOUR_EC2_PUBLIC_IP>

# 3. Generate certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 🛠️ Useful Management Commands on EC2

```bash
# View live logs of all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx

# Check memory usage in real time
free -h
docker stats

# Restart services
docker compose restart

# Pull latest code and redeploy
git pull
docker compose up -d --build
```
