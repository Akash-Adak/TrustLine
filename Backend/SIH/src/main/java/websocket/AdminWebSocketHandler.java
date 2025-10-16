package websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class AdminWebSocketHandler extends TextWebSocketHandler {

    private static final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("Admin connected: " + session.getId());
        sendWelcomeMessage(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        sessions.remove(session);
        System.out.println("Admin disconnected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Map<String, Object> messageMap = objectMapper.readValue(message.getPayload(), Map.class);
            String type = (String) messageMap.get("type");

            switch (type) {
                case "PING":
                    handlePing(session);
                    break;
                case "REQUEST_STATS":
                    handleStatsRequest(session);
                    break;
                default:
                    System.out.println("Unknown message type: " + type);
            }
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
        }
    }

    private void handlePing(WebSocketSession session) throws IOException {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "PONG");
        response.put("timestamp", System.currentTimeMillis());
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
    }

    private void handleStatsRequest(WebSocketSession session) throws IOException {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "STATS_RESPONSE");
        response.put("timestamp", System.currentTimeMillis());
        response.put("message", "Stats request received");
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
    }

    private void sendWelcomeMessage(WebSocketSession session) throws IOException {
        Map<String, Object> welcomeMessage = new HashMap<>();
        welcomeMessage.put("type", "WELCOME");
        welcomeMessage.put("message", "Connected to Admin Dashboard WebSocket");
        welcomeMessage.put("sessionId", session.getId());
        welcomeMessage.put("timestamp", System.currentTimeMillis());
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(welcomeMessage)));
    }

    public static void broadcastToAdmins(String message) {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    System.err.println("Error sending message to admin: " + e.getMessage());
                }
            }
        }
    }

    public static int getConnectedAdminCount() {
        return sessions.size();
    }
}
