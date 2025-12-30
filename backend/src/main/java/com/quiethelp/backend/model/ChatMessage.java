package com.quiethelp.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public class ChatMessage {
    private String roomId;
    private String senderSessionId;
    private String message;
    private Instant timestamp;

    @JsonCreator
    public ChatMessage(@JsonProperty("roomId") String roomId,
                      @JsonProperty("senderSessionId") String senderSessionId,
                      @JsonProperty("message") String message,
                      @JsonProperty("timestamp") Instant timestamp) {
        this.roomId = roomId;
        this.senderSessionId = senderSessionId;
        this.message = message;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    // Getters and setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getSenderSessionId() { return senderSessionId; }
    public void setSenderSessionId(String senderSessionId) { this.senderSessionId = senderSessionId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

