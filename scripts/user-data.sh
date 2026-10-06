#!/bin/bash
set -e

# Log all output to /var/log/user-data.log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=================================================="
echo " Starting ChessTogether Automated UserData Setup "
echo "=================================================="

# 1. Setup 2GB Swap (Essential for t3.micro memory management)
if [ ! -f /swapfile ]; then
    echo "Creating 2GB swapfile..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=20' >> /etc/sysctl.conf
    sysctl -p || true
fi

# 2. Install Docker & Compose plugin
apt-get update -y
apt-get install -y ca-certificates curl gnupg git
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm -f get-docker.sh
    systemctl enable docker
    systemctl start docker
fi

# Add ubuntu user to docker group
usermod -aG docker ubuntu || true

# 3. Clone Repository and Start Backend via Docker Compose
cd /home/ubuntu
git clone https://github.com/abhishukla0807-dev/ChessTogether.git
cd ChessTogether/ChessTogether-main
chown -R ubuntu:ubuntu /home/ubuntu/ChessTogether

echo "Starting Backend and Nginx containers..."
docker compose -f docker-compose.backend.yml up -d --build

echo "=================================================="
echo " ChessTogether Backend Bootstrap Complete!        "
echo "=================================================="
