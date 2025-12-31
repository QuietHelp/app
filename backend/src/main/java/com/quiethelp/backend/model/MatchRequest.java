package com.quiethelp.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MatchRequest {
    private String sessionId;
    private MoodType mood;
    private Integer age;
    private String country;

    // Default constructor required for Spring WebSocket message deserialization
    public MatchRequest() {
    }

    @JsonCreator
    public MatchRequest(@JsonProperty("sessionId") String sessionId, 
                       @JsonProperty("mood") MoodType mood,
                       @JsonProperty("age") Integer age,
                       @JsonProperty("country") String country) {
        this.sessionId = sessionId;
        this.mood = mood;
        this.age = age;
        this.country = country;
    }

    // Getters and setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public MoodType getMood() { return mood; }
    public void setMood(MoodType mood) { this.mood = mood; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}

