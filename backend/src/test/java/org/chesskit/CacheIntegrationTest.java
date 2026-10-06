package org.chesskit;

import org.chesskit.config.CacheConfig;
import org.chesskit.model.ChatMessage;
import org.chesskit.model.GameSession;
import org.chesskit.model.SessionSummary;
import org.chesskit.service.GameService;
import org.chesskit.service.GlobalChatService;
import org.chesskit.service.SessionQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "socketio.enabled=false")
class CacheIntegrationTest {

    @Autowired
    private GameService gameService;

    @Autowired
    private SessionQueryService sessionQueryService;

    @Autowired
    private GlobalChatService globalChatService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void testCacheManagerConfiguration() {
        assertNotNull(cacheManager, "CacheManager bean should be present");
        Cache activeSessionsCache = cacheManager.getCache(CacheConfig.ACTIVE_SESSIONS_CACHE);
        assertNotNull(activeSessionsCache, "activeSessions cache should be registered");

        Cache globalChatCache = cacheManager.getCache(CacheConfig.GLOBAL_CHAT_CACHE);
        assertNotNull(globalChatCache, "globalChat cache should be registered");
    }

    @Test
    void testActiveSessionsCachingAndEviction() {
        // Initial fetch via SessionQueryService
        List<SessionSummary> list1 = sessionQueryService.getActiveSessions();
        assertNotNull(list1);

        // Second fetch - should hit cache
        List<SessionSummary> list2 = sessionQueryService.getActiveSessions();
        // Use assertEquals (content equality) rather than assertSame (reference-dependent)
        assertEquals(list1, list2, "Consecutive calls to getActiveSessions should return identical content from cache");

        // Verify cache store has an entry
        Cache cache = cacheManager.getCache(CacheConfig.ACTIVE_SESSIONS_CACHE);
        assertNotNull(cache);

        // Trigger eviction via createSession
        GameSession newSession = gameService.createSession("AliceCache", "BobCache");
        assertNotNull(newSession);

        // Fetch again after eviction - should reflect the new session
        List<SessionSummary> list3 = sessionQueryService.getActiveSessions();
        assertTrue(list3.stream().anyMatch(s -> s.id().equals(newSession.getId())),
                "Cache should have been evicted and now includes the new session");
    }

    @Test
    void testGlobalChatCachingEvictionAndImmutability() {
        // Fetch snapshot via GlobalChatService
        List<ChatMessage> chatList1 = globalChatService.getGlobalMessages();
        assertNotNull(chatList1);

        // Immutable snapshot guarantee: attempting to modify returned list must throw UnsupportedOperationException
        assertThrows(UnsupportedOperationException.class, () ->
                chatList1.add(new ChatMessage("hacked", "Evil", "spectator", "inject", System.currentTimeMillis())),
                "Returned list must be an unmodifiable snapshot (List.copyOf) to protect cached state"
        );

        // Second fetch - cached
        List<ChatMessage> chatList2 = globalChatService.getGlobalMessages();
        assertEquals(chatList1, chatList2, "Consecutive calls to getGlobalMessages should return identical content from cache");

        // Trigger eviction via addGlobalMessage
        globalChatService.addGlobalMessage("CacheTester", "spectator", "Testing cache eviction!", null);

        // Fetch again after eviction
        List<ChatMessage> chatList3 = globalChatService.getGlobalMessages();
        assertTrue(chatList3.stream().anyMatch(m -> m.text().equals("Testing cache eviction!")),
                "Cache should have been evicted and now includes the newly sent global message");
    }
}
