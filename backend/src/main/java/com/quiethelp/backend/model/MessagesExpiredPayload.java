package com.quiethelp.backend.model;

import java.util.List;

/**
 * WebSocket payload sent when messages are expired by the cleanup job.
 * Clients should remove messages with these timestamps from their UI.
 */
public class MessagesExpiredPayload {
    public static final String TYPE = "messagesExpired";
    private String type = TYPE;
    private String roomId; // null for global chat
    private List<Long> expiredTimestamps;

    public MessagesExpiredPayload() {
    }

    public MessagesExpiredPayload(String roomId, List<Long> expiredTimestamps) {
        this.roomId = roomId;
        this.expiredTimestamps = expiredTimestamps;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public List<Long> getExpiredTimestamps() {
        return expiredTimestamps;
    }

    public void setExpiredTimestamps(List<Long> expiredTimestamps) {
        this.expiredTimestamps = expiredTimestamps;
    }
}
