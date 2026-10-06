package org.chesskit.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Cache configuration using Spring Boot's Cache abstraction backed by Caffeine.
 *
 * <h3>Design &amp; Architecture Notes:</h3>
 * <ul>
 *   <li><b>Per-JVM / Local Scope:</b> Caffeine is an in-process, per-JVM cache. It provides
 *       microsecond read latencies, but cache entries and evictions do NOT propagate across
 *       horizontally scaled backend replicas. For multi-instance deployments, use Redis.</li>
 *   <li><b>TTL Semantics:</b> The 5s and 3s write TTLs configured below represent cosmetic
 *       staleness tolerance to dampen polling/burst requests from clients. They are NOT a
 *       correctness or hard consistency guarantee.</li>
 *   <li><b>Cache Metrics:</b> Native statistics are recorded via {@code .recordStats()}.
 *       To expose these via Spring Boot Actuator (/actuator/metrics), bind them using
 *       Micrometer's {@code CaffeineCacheMetrics.monitor(...)}.</li>
 * </ul>
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String ACTIVE_SESSIONS_CACHE = "activeSessions";
    public static final String GLOBAL_CHAT_CACHE = "globalChat";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        // Active Sessions cache: 5 seconds TTL to absorb lobby polling bursts, up to 500 session summaries
        cacheManager.registerCustomCache(
                ACTIVE_SESSIONS_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(5, TimeUnit.SECONDS)
                        .maximumSize(500)
                        .recordStats()
                        .build()
        );

        // Global Chat cache: 3 seconds TTL for lobby chat history snapshot, up to 100 entries
        cacheManager.registerCustomCache(
                GLOBAL_CHAT_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(3, TimeUnit.SECONDS)
                        .maximumSize(100)
                        .recordStats()
                        .build()
        );

        return cacheManager;
    }
}
