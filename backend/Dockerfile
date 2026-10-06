# ── Multi-stage Dockerfile for ChessTogether Backend ──
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Runtime Image ──
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /workspace/target/chesskit-backend-*.jar app.jar

ENV SERVER_PORT=8080
ENV SOCKETIO_PORT=9092
ENV SOCKETIO_HOST=0.0.0.0
ENV JAVA_OPTS="-XX:+UseSerialGC -Xms128m -Xmx280m"

EXPOSE 8080
EXPOSE 9092

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
