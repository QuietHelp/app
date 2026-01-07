package com.quiethelp.backend.controller;

import com.quiethelp.backend.model.ChatMessageResponse;
import com.quiethelp.backend.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// REST controller for retrieving chat history
@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatHistoryController.class);
    
    @Autowired
    private ChatService chatService;
    
    // REST endpoint to retrieve chat history
    // Useful for clients connecting after page refresh
    // Supports both broadcast chat (no roomId) and room-based chat (with roomId parameter)
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getChatHistory(@RequestParam(required = false) String roomId) {
        try {
            List<ChatMessageResponse> messages = chatService.getChatHistory(roomId);
            
            return ResponseEntity.ok(Map.of(
                "messages", messages,
                "count", messages.size(),
                "roomId", roomId != null ? roomId : "broadcast"
            ));
            
        } catch (Exception e) {
            logger.error("Error retrieving chat history: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve chat history"));
        }
    }
}

