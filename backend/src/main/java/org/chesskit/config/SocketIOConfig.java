package org.chesskit.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;

/**
 * Factory configuration for {@link SocketIOServer}.
 * Dependency Inversion Principle: the server is now a Spring-managed bean,
 * injectable and testable — no more {@code new SocketIOServer()} inside consumers.
 */
@org.springframework.context.annotation.Configuration
@ConditionalOnProperty(name = "socketio.enabled", matchIfMissing = true, havingValue = "true")
public class SocketIOConfig {

    @Bean
    public SocketIOServer socketIOServer(
            @Value("${socketio.host:0.0.0.0}") String host,
            @Value("${socketio.port:9092}") int port,
            @Value("${socketio.path:/api/socket_io}") String path
    ) {
        Configuration config = new Configuration();
        config.setHostname(host);
        config.setPort(port);
        config.setContext(path);
        config.setOrigin("*");
        config.setEnableCors(true);
        config.setPingInterval(8000);
        config.setPingTimeout(4000);
        return new SocketIOServer(config);
    }
}
