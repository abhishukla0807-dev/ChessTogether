#!/usr/bin/env bash
# ==============================================================================
# ChessTogether - Automated Deployment Script for AWS EC2 (t3.micro / Ubuntu)
# ==============================================================================
set -e

echo "=========================================================="
echo "  Deploying ChessTogether on AWS EC2 (t3.micro)"
echo "=========================================================="

# 1. Ensure Root Privileges
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run as root (use: sudo bash deploy-aws.sh)"
  exit 1
fi

# 2. Configure 4GB Swap Space (CRITICAL for 1GB RAM on t3.micro)
if [ ! -f /swapfile ]; then
  echo "[1/5] Setting up 4GB Swap Space to prevent Out-Of-Memory errors..."
  fallocate -l 4G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=4096
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo 'vm.swappiness=20' >> /etc/sysctl.conf
  sysctl -p || true
  echo "Swap configured successfully:"
  free -h
else
  echo "[1/5] Swap space already configured."
fi

# 3. Install Docker & Docker Compose (if not already installed)
echo "[2/5] Checking Docker installation..."
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg lsb-release
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm -f get-docker.sh
  systemctl enable docker
  systemctl start docker
fi

# 4. Configure Firewall (UFW)
echo "[3/5] Configuring firewall rules (Ports 22, 80, 443)..."
if command -v ufw &> /dev/null; then
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable || true
fi

# 5. Build and Launch Containers with Docker Compose
echo "[4/5] Building and starting ChessTogether containers..."
docker compose down || true
docker compose up -d --build

# 6. Verification & Output
echo "[5/5] Checking container status..."
sleep 5
docker compose ps

# Detect Public IP
PUBLIC_IP=$(curl -s -m 5 https://checkip.amazonaws.com || curl -s -m 5 https://ifconfig.me || echo "<YOUR_EC2_PUBLIC_IP>")

echo ""
echo "=========================================================="
echo "  🎉 Deployment Complete!"
echo "=========================================================="
echo "  Frontend & App:  http://${PUBLIC_IP}"
echo "  Play Match:      http://${PUBLIC_IP}/play"
echo "  Backend API:     http://${PUBLIC_IP}/api/sessions"
echo "  Socket.IO:       ws://${PUBLIC_IP}/api/socket_io"
echo "=========================================================="
echo "  To view logs:"
echo "    docker compose logs -f"
echo "  To restart:"
echo "    docker compose restart"
echo "=========================================================="
