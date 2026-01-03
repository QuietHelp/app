package com.quiethelp.backend.controller;

import com.quiethelp.backend.service.SessionService;
import com.quiethelp.backend.service.MatchingService;
import com.quiethelp.backend.model.MoodType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/session")
    public ResponseEntity<Map<String, String>> createSession() {
        String sessionId = UUID.randomUUID().toString();
        sessionService.recordSessionCreated(sessionId);
        return ResponseEntity.ok(Map.of("sessionId", sessionId));
    }
    @GetMapping("/global-chat/session")
    public ResponseEntity<Map<String, String>> createGlobalChatSession() {
        String sessionId = UUID.randomUUID().toString();
        sessionService.recordSessionCreated(sessionId);
        return ResponseEntity.ok(Map.of("sessionId", sessionId));
    }

    @PostMapping("/session/{sessionId}/end")
    public ResponseEntity<Map<String, String>> endSession(@PathVariable String sessionId) {
        try {
            matchingService.endSession(sessionId);
            return ResponseEntity.ok(Map.of("status", "ended"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "failed"));
        }
    }

    @PostMapping("/session/{sessionId}/change-friend")
    public ResponseEntity<Map<String, String>> changeFriend(@PathVariable String sessionId, @RequestBody(required = false) Map<String, Object> body) {
        try {
            // Expect optional fields: mood (string), age (number), country (string)
            String moodStr = body != null && body.get("mood") != null ? body.get("mood").toString() : null;
            Integer age = null;
            String country = null;
            if (body != null && body.get("age") != null) {
                try { age = Integer.parseInt(body.get("age").toString()); } catch (Exception ignore) {}
            }
            if (body != null && body.get("country") != null) {
                country = body.get("country").toString();
            }

            MoodType mood = null;
            if (moodStr != null) {
                try { mood = MoodType.valueOf(moodStr); } catch (Exception ignore) { mood = MoodType.NOT_SURE; }
            }

            matchingService.changeFriend(sessionId, mood, age, country);
            return ResponseEntity.ok(Map.of("status", "queued"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "failed"));
        }
    }
}

