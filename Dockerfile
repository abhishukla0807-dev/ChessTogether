# ==============================================================================
# ChessTogether All-in-One Railway Dockerfile
# Builds Java Spring Boot backend, Next.js frontend, and runs them with Nginx
# ==============================================================================

# ── Stage 1: Build Spring Boot Backend ──
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Build Next.js Frontend ──
FROM node:22-alpine AS frontend-builder
WORKDIR /frontend
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Unified Production Runtime ──
FROM alpine:3.21 AS runner

# Install OpenJDK 21, Node.js 22, npm, Nginx, and gettext (envsubst)
RUN apk add --no-cache \
    openjdk21-jre \
    nodejs \
    npm \
    nginx \
    gettext

WORKDIR /app

# Copy Backend JAR
COPY --from=backend-builder /backend/target/chesskit-backend-*.jar /app/backend/app.jar

# Copy Frontend Build & Dependencies
WORKDIR /app/frontend
COPY --from=frontend-builder /frontend/package*.json ./
COPY --from=frontend-builder /frontend/node_modules ./node_modules
COPY --from=frontend-builder /frontend/.next ./.next
COPY --from=frontend-builder /frontend/public ./public

# Copy Nginx configuration template and entrypoint script
COPY docker/nginx.railway.conf.template /etc/nginx/nginx.conf.template
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

WORKDIR /app

# Railway passes $PORT dynamically
ENV PORT=8080
EXPOSE 8080

CMD ["/app/start.sh"]
