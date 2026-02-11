package com.quiethelp.backend.model;

import java.time.Instant;

// Response DTO for chat messages sent to clients
// Supports both broadcast chat (no roomId) and room-based chat (with roomId)
// Message expiry: createdAt + 30 min = expiresAt; backend filters and cleanup enforce this.
public class ChatMessageResponse {

    /** Chat type for expiry and filtering */
    public static final String CHAT_TYPE_GLOBAL = "GLOBAL";
    public static final String CHAT_TYPE_PEER = "PEER";
    public static final String CHAT_TYPE_AI = "AI";

    private String username;
    private String message;
    private long timestamp;
    private String roomId; // Optional, for room-based chat
    private String senderSessionId; // Optional, for room-based chat
    private long createdAt;   // Epoch ms, set on insert
    private long expiresAt;   // Epoch ms, createdAt + 30 minutes
    private String chatType; // GLOBAL | PEER | AI

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

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public long getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(long expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getChatType() {
        return chatType;
    }

    public void setChatType(String chatType) {
        this.chatType = chatType;
    }
}

