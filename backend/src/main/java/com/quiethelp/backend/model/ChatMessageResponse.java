package com.quiethelp.backend.model;

import java.time.Instant;

// Response DTO for chat messages sent to clients
// Supports both broadcast chat (no roomId) and room-based chat (with roomId)
public class ChatMessageResponse {
    
    private String username;
    private String message;
    private long timestamp;
    private String roomId; // Optional, for room-based chat
    private String senderSessionId; // Optional, for room-based chat
    
    public ChatMessageResponse() {
    }
    
    public ChatMessageResponse(String username, String message, long timestamp) {
        this.username = username;
        this.message = message;
        this.timestamp = timestamp;
    }
    
    public ChatMessageResponse(String username, String message) {
        this.username = username;
        this.message = message;
        this.timestamp = Instant.now().toEpochMilli();
    }
    
    public ChatMessageResponse(String username, String message, long timestamp, String roomId, String senderSessionId) {
        this.username = username;
        this.message = message;
        this.timestamp = timestamp;
        this.roomId = roomId;
        this.senderSessionId = senderSessionId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getRoomId() {
        return roomId;
    }
    
    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
    
    public String getSenderSessionId() {
        return senderSessionId;
    }
    
    public void setSenderSessionId(String senderSessionId) {
        this.senderSessionId = senderSessionId;
    }
}

