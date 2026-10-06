#!/usr/bin/env bash
# ==============================================================================
# ChessTogether - Backend Automated Deployment Script for AWS EC2 (t3.micro)
# ==============================================================================
set -e

echo "=========================================================="
echo "  Deploying ChessTogether Backend on AWS EC2 (t3.micro)"
echo "=========================================================="

# 1. Ensure Root Privileges
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run as root (use: sudo bash deploy-backend.sh)"
  exit 1
fi

# 2. Configure 2GB Swap Space
if [ ! -f /swapfile ]; then
  echo "[1/4] Setting up 2GB Swap Space..."
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo 'vm.swappiness=20' >> /etc/sysctl.conf
  sysctl -p || true
  free -h
else
  echo "[1/4] Swap space already configured."
fi

# 3. Install Docker & Compose (if not present)
echo "[2/4] Checking Docker installation..."
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm -f get-docker.sh
  systemctl enable docker
  systemctl start docker
fi

# 4. Configure Firewall
echo "[3/4] Configuring firewall (Ports 22, 80, 443)..."
if command -v ufw &> /dev/null; then
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable || true
fi

# 5. Build and Launch Backend
echo "[4/4] Building and launching Backend + Nginx containers..."
docker compose -f docker-compose.backend.yml down || true
docker compose -f docker-compose.backend.yml up -d --build

sleep 4
docker compose -f docker-compose.backend.yml ps

PUBLIC_IP=$(curl -s -m 5 https://checkip.amazonaws.com || curl -s -m 5 https://ifconfig.me || echo "<YOUR_EC2_PUBLIC_IP>")

echo ""
echo "=========================================================="
echo "  🎉 AWS Backend Deployment Complete!"
echo "=========================================================="
echo "  REST API Endpoint:   http://${PUBLIC_IP}/api/sessions"
echo "  Socket.IO Endpoint:  ws://${PUBLIC_IP}/api/socket_io"
echo "=========================================================="
echo "  Next Step: Use this IP in your Vercel Environment Variables:"
echo "    BACKEND_URL            = http://${PUBLIC_IP}"
echo "    NEXT_PUBLIC_SOCKET_URL = http://${PUBLIC_IP}"
echo "=========================================================="
