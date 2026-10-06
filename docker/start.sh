#!/bin/sh
set -e

# Default PORT to 8080 if not set by Railway
export PORT="${PORT:-8080}"
echo "Starting ChessTogether on Railway with PORT=$PORT..."

# 1. Substitute $PORT into Nginx config
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# 2. Start Java Spring Boot + Netty-SocketIO backend
echo "Starting Backend on ports 8080 (REST) and 9092 (Socket.IO)..."
java -jar /app/backend/app.jar &
BACKEND_PID=$!

# 3. Start Next.js frontend
echo "Starting Next.js frontend on port 3000..."
cd /app/frontend
PORT=3000 npm run start &
FRONTEND_PID=$!

# 4. Start Nginx reverse proxy in foreground
echo "Starting Nginx reverse proxy on port $PORT..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait for any process to exit
wait -n $BACKEND_PID $FRONTEND_PID $NGINX_PID
exit $?
