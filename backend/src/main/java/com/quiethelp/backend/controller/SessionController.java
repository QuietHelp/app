package com.quiethelp.backend.controller;

import com.quiethelp.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SessionController {

    @Autowired
    private SessionService sessionService;

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
}

