package com.quiethelp.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MatchFound {
    private String roomId;
    private String peerSessionId;

    @JsonCreator
    public MatchFound(@JsonProperty("roomId") String roomId, 
                     @JsonProperty("peerSessionId") String peerSessionId) {
        this.roomId = roomId;
        this.peerSessionId = peerSessionId;
    }

    // Getters and setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getPeerSessionId() { return peerSessionId; }
    public void setPeerSessionId(String peerSessionId) { this.peerSessionId = peerSessionId; }
}

