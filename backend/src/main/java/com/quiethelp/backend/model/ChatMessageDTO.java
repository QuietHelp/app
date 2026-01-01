package com.quiethelp.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO for chat messages sent from client
// Supports both broadcast chat (no roomId) and room-based chat (with roomId)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessageDTO {
    
    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;
    
    private String username; // Optional, will be assigned if not provided
    
    private String roomId; // Optional, for room-based chat
    
    private String senderSessionId; // Optional, for room-based chat (will use sessionId from header if not provided)
    
    public ChatMessageDTO() {
    }
    
    public ChatMessageDTO(String message, String username) {
        this.message = message;
        this.username = username;
    }
    
    // Getters and setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
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

