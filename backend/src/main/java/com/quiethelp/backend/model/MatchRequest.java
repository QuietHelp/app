package com.quiethelp.backend.model;

public class MatchRequest {
    private String sessionId;
    private MoodType mood;
    private Integer age;
    private String country;

    // Default constructor required for Spring WebSocket message deserialization
    public MatchRequest() {
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

