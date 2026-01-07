package com.quiethelp.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quiethelp.backend.model.ChatMessageDTO;
import com.quiethelp.backend.model.ChatMessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

// Service for handling chat operations: broadcasting messages and managing Redis storage
@Service
public class ChatService {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private static final String REDIS_MESSAGE_KEY = "chat:messages";
    private static final String REDIS_ROOM_MESSAGE_KEY_PREFIX = "chat:room:";
    private static final int MAX_MESSAGES = 100;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Autowired
    private UsernameService usernameService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Processes and broadcasts a new chat message
    // Supports both broadcast chat (no roomId) and room-based chat (with roomId)
    public void processMessage(ChatMessageDTO messageDTO, String username) {
        try {
            // Use provided username or generate one
            String finalUsername = (username != null && !username.trim().isEmpty()) 
                ? username.trim() 
                : usernameService.generateUsername();
            
            // Determine if this is a room-based chat
            boolean isRoomChat = messageDTO.getRoomId() != null && !messageDTO.getRoomId().trim().isEmpty();
            String senderSessionId = messageDTO.getSenderSessionId();
            
            // Create response with timestamp
            ChatMessageResponse response;
            if (isRoomChat) {
                // Room-based chat: include roomId and senderSessionId
                response = new ChatMessageResponse(
                    finalUsername,
                    messageDTO.getMessage().trim(),
                    Instant.now().toEpochMilli(),
                    messageDTO.getRoomId(),
                    senderSessionId
                );
            } else {
                // Broadcast chat: no roomId or senderSessionId
                response = new ChatMessageResponse(
                    finalUsername,
                    messageDTO.getMessage().trim(),
                    Instant.now().toEpochMilli()
                );
                // Set senderSessionId if provided for broadcast chat
                if (senderSessionId != null && !senderSessionId.trim().isEmpty()) {
                    response.setSenderSessionId(senderSessionId);
                }
            }
            
            // Store in Redis (per room if room-based, globally if broadcast)
            storeMessage(response, isRoomChat ? messageDTO.getRoomId() : null);
            
            // Broadcast message (to room topic if room-based, global topic if broadcast)
            broadcastMessage(response, isRoomChat ? messageDTO.getRoomId() : null);
            
            logger.debug("Message processed from {} in {}: {}", 
                finalUsername, 
                isRoomChat ? "room " + messageDTO.getRoomId() : "broadcast",
                messageDTO.getMessage());
            
            
        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process message", e);
        }
    }
    
    // Stores message in Redis as a capped list (last 100 messages)
    // If roomId is provided, stores per room; otherwise stores globally
    private void storeMessage(ChatMessageResponse message, String roomId) {
        try {
            String redisKey = (roomId != null && !roomId.trim().isEmpty())
                ? REDIS_ROOM_MESSAGE_KEY_PREFIX + roomId
                : REDIS_MESSAGE_KEY;
            
            // Convert message to JSON string
            String messageJson = objectMapper.writeValueAsString(message);
            
            // Add to Redis list and trim to keep last MAX_MESSAGES
            redisTemplate.opsForList().rightPush(redisKey, messageJson);
            redisTemplate.opsForList().trim(redisKey, -MAX_MESSAGES, -1);
            
            // Set TTL to 30 minutes for room-based chats, 1 hour for broadcast
            long ttlMinutes = (roomId != null && !roomId.trim().isEmpty()) ? 30 : 60;
            redisTemplate.expire(redisKey, ttlMinutes, TimeUnit.MINUTES);
            
            logger.debug("Message stored in Redis: {}", redisKey);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing message to JSON: {}", e.getMessage(), e);
            // Don't throw - allow message to still be broadcast even if storage fails
        } catch (Exception e) {
            logger.error("Error storing message in Redis: {}", e.getMessage(), e);
            // Don't throw - allow message to still be broadcast even if storage fails
        }
    }
    
    // Broadcasts message via WebSocket
    // If roomId is provided, broadcasts to room topic; otherwise broadcasts to global topic
    private void broadcastMessage(ChatMessageResponse message, String roomId) {
        try {
            String topic = (roomId != null && !roomId.trim().isEmpty())
                ? "/topic/chat/" + roomId
                : "/topic/chat";
            
            logger.debug("Broadcasting message to topic: '{}' (roomId was: '{}')", topic, roomId);
            messagingTemplate.convertAndSend(topic, message);
            logger.debug("Message broadcast successfully to: '{}'", topic);
        } catch (Exception e) {
            logger.error("Error broadcasting message: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Retrieves chat history from Redis
    // Returns list of recent messages (up to MAX_MESSAGES)
    // If roomId is provided, retrieves room-specific history; otherwise retrieves broadcast history
    public List<ChatMessageResponse> getChatHistory(String roomId) {
        try {
            String redisKey = (roomId != null && !roomId.trim().isEmpty())
                ? REDIS_ROOM_MESSAGE_KEY_PREFIX + roomId
                : REDIS_MESSAGE_KEY;
            
            List<String> messageJsonList = redisTemplate.opsForList().range(redisKey, 0, -1);
            
            if (messageJsonList == null || messageJsonList.isEmpty()) {
                return new ArrayList<>();
            }
            
            List<ChatMessageResponse> messages = new ArrayList<>();
            for (String messageJson : messageJsonList) {
                try {
                    ChatMessageResponse message = objectMapper.readValue(messageJson, ChatMessageResponse.class);
                    messages.add(message);
                } catch (JsonProcessingException e) {
                    logger.warn("Error deserializing message from Redis: {}", e.getMessage());
                    // Skip malformed messages but continue processing others
                }
            }
            
            logger.debug("Retrieved {} messages from Redis key: {}", messages.size(), redisKey);
            return messages;
        } catch (Exception e) {
            logger.error("Error retrieving chat history from Redis: {}", e.getMessage(), e);
            return new ArrayList<>(); // Return empty list on error rather than failing
        }
    }
    
    // Overload for backward compatibility - retrieves broadcast chat history
    public List<ChatMessageResponse> getChatHistory() {
        return getChatHistory(null);
    }
    
    // Clears chat history (useful for testing or maintenance)
    // If roomId is provided, clears room-specific history; otherwise clears broadcast history
    public void clearHistory(String roomId) {
        try {
            String redisKey = (roomId != null && !roomId.trim().isEmpty())
                ? REDIS_ROOM_MESSAGE_KEY_PREFIX + roomId
                : REDIS_MESSAGE_KEY;
            redisTemplate.delete(redisKey);
            logger.info("Chat history cleared for key: {}", redisKey);
        } catch (Exception e) {
            logger.error("Error clearing chat history: {}", e.getMessage(), e);
        }
    }
    
    // Overload for backward compatibility - clears broadcast chat history
    public void clearHistory() {
        clearHistory(null);
    }
}
