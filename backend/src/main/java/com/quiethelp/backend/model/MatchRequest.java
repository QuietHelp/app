package com.quiethelp.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MatchRequest {
    private String sessionId;
    private MoodType mood;

    @JsonCreator
    public MatchRequest(@JsonProperty("sessionId") String sessionId, 
                       @JsonProperty("mood") MoodType mood) {
        this.sessionId = sessionId;
        this.mood = mood;
    }

    // Getters and setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public MoodType getMood() { return mood; }
    public void setMood(MoodType mood) { this.mood = mood; }
}

