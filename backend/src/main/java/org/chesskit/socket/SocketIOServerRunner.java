package org.chesskit.socket;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Minimal lifecycle manager for the Netty-SocketIO server.
 *
 * <p>SOLID Compliance:
 * <ul>
 *   <li><b>SRP</b>: Only starts/stops the server — no event routing, no config creation.</li>
 *   <li><b>OCP</b>: New event handlers are added by implementing {@link SocketEventHandler}
 *       and registering as a Spring bean. This class auto-discovers them via injection.</li>
 *   <li><b>DIP</b>: Depends on the {@link SocketIOServer} bean (from config) and
 *       {@link SocketEventHandler} abstractions — not concrete handlers.</li>
 * </ul>
 */
@Component
@ConditionalOnProperty(name = "socketio.enabled", matchIfMissing = true, havingValue = "true")
public class SocketIOServerRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SocketIOServerRunner.class);

    private final SocketIOServer server;
    private final List<SocketEventHandler> eventHandlers;

    public SocketIOServerRunner(SocketIOServer server, List<SocketEventHandler> eventHandlers) {
        this.server = server;
        this.eventHandlers = eventHandlers;
    }

    @Override
    public void run(String... args) {
        // Auto-discover and register all event handlers (OCP)
        eventHandlers.forEach(handler -> handler.register(server));

        log.info("Starting Netty-SocketIO server on {}:{}", server.getConfiguration().getHostname(), server.getConfiguration().getPort());
        server.start();
    }

    @PreDestroy
    public void stop() {
        log.info("Stopping Netty-SocketIO server...");
        server.stop();
    }

    public SocketIOServer getServer() {
        return server;
    }
}
