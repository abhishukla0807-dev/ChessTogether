package org.chesskit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Production Health Check Controller for monitoring, load balancers,
 * Railway / Docker health checks, and deployment verification.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "app", "chesskit-backend",
                "timestamp", Instant.now().toEpochMilli(),
                "service", "ChessTogether Dual-Mode Server"
        ));
    }
}
