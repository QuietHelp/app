package com.quiethelp.backend.service;

import com.quiethelp.backend.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MetricsService metricsService;

    public void sendMessage(ChatMessage chatMessage) {
        // Broadcast to room
        messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getRoomId(), chatMessage);
        
        // Record metric (NO message content)
        metricsService.recordEvent("CHAT_MESSAGE_SENT", chatMessage.getSenderSessionId(), 
            Map.of("roomId", chatMessage.getRoomId()));
    }
}

