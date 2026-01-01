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

// Service for handling chat operations: broadcasting messages and managing Redis storage
@Service
public class ChatService {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private static final String REDIS_MESSAGE_KEY = "chat:messages";
    private static final String REDIS_ROOM_MESSAGE_KEY_PREFIX = "chat:room:";
    private static final int MAX_MESSAGES = 100; // Keep last 100 messages in Redis

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
    public ChatMessageResponse processMessage(ChatMessageDTO messageDTO, String username) {
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
            }
            
            // Store in Redis (per room if room-based, globally if broadcast)
            storeMessage(response, isRoomChat ? messageDTO.getRoomId() : null);
            
            // Broadcast message (to room topic if room-based, global topic if broadcast)
            broadcastMessage(response, isRoomChat ? messageDTO.getRoomId() : null);
            
            logger.debug("Message processed from {} in {}: {}", 
                finalUsername, 
                isRoomChat ? "room " + messageDTO.getRoomId() : "broadcast",
                messageDTO.getMessage());
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process message", e);
        }
    }
    
    // Stores message in Redis as a capped list (last 100 messages)
    // If roomId is provided, stores per room; otherwise stores globally
    private void storeMessage(ChatMessageResponse message, String roomId) {
        try {
            String messageJson = objectMapper.writeValueAsString(message);
            
            // Determine Redis key (per room or global)
            String redisKey = (roomId != null && !roomId.trim().isEmpty())
                ? REDIS_ROOM_MESSAGE_KEY_PREFIX + roomId
                : REDIS_MESSAGE_KEY;
            
            // Add to list
            redisTemplate.opsForList().rightPush(redisKey, messageJson);
            
            // Trim list to keep only last MAX_MESSAGES
            redisTemplate.opsForList().trim(redisKey, -MAX_MESSAGES, -1);
            
            // Set expiration (24 hours) to prevent unlimited growth
            redisTemplate.expire(redisKey, java.time.Duration.ofHours(24));
            
        } catch (JsonProcessingException e) {
            logger.error("Error serializing message to JSON: {}", e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error storing message in Redis: {}", e.getMessage(), e);
            // Don't throw - allow message to be broadcast even if Redis fails
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
    public List<ChatMessageResponse> getChatHistory() {
        List<ChatMessageResponse> history = new ArrayList<>();
        
        try {
            // Get all messages from Redis list
            List<String> messageJsons = redisTemplate.opsForList().range(REDIS_MESSAGE_KEY, 0, -1);
            
            if (messageJsons != null) {
                for (String messageJson : messageJsons) {
                    try {
                        ChatMessageResponse message = objectMapper.readValue(messageJson, ChatMessageResponse.class);
                        history.add(message);
                    } catch (JsonProcessingException e) {
                        logger.warn("Error deserializing message from Redis: {}", e.getMessage());
                        // Skip malformed messages
                    }
                }
            }
            
            logger.debug("Retrieved {} messages from chat history", history.size());
            
        } catch (Exception e) {
            logger.error("Error retrieving chat history from Redis: {}", e.getMessage(), e);
            // Return empty list on error rather than failing
        }
        
        return history;
    }
    
    // Clears chat history (useful for testing or maintenance)
    public void clearHistory() {
        try {
            redisTemplate.delete(REDIS_MESSAGE_KEY);
            logger.info("Chat history cleared");
        } catch (Exception e) {
            logger.error("Error clearing chat history: {}", e.getMessage(), e);
        }
    }
}
