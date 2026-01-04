package com.quiethelp.backend.controller;

import com.quiethelp.backend.model.ChatMessageDTO;
import com.quiethelp.backend.service.ChatService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

// WebSocket controller for handling chat messages
// Clients send to: /app/chat.send
// Clients subscribe to: /topic/chat
@Controller
public class ChatController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    @Autowired
    private ChatService chatService;
    
    // WebSocket endpoint for sending messages
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload @Valid ChatMessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        try {
            logger.debug("Received chat message - roomId: '{}', senderSessionId: '{}', message: '{}'", 
                messageDTO.getRoomId(), messageDTO.getSenderSessionId(), messageDTO.getMessage());
            
            // Extract username from DTO first, then from session attributes as fallback
            String username = messageDTO.getUsername();
            if (username == null || username.trim().isEmpty()) {
                var sessionAttributes = headerAccessor.getSessionAttributes();
                if (sessionAttributes != null) {
                    username = (String) sessionAttributes.get("username");
                }
            }
            
            // Process and broadcast message
            chatService.processMessage(messageDTO, username);
            
        } catch (Exception e) {
            logger.error("Error handling chat message: {}", e.getMessage(), e);
            // Error is logged but not sent to client to avoid exposing internals
        }
    }
}
