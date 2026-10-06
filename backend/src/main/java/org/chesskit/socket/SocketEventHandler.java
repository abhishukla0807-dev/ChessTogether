package org.chesskit.socket;

import com.corundumstudio.socketio.SocketIOServer;

/**
 * Extension point for registering socket event listeners.
 * Open/Closed Principle: new event handlers can be added by implementing
 * this interface without modifying existing handlers or the server runner.
 */
public interface SocketEventHandler {

    /**
     * Register event listeners on the given server.
     */
    void register(SocketIOServer server);
}
