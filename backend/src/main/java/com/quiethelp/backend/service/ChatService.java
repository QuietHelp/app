package com.quiethelp.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quiethelp.backend.model.ChatMessageDTO;
import com.quiethelp.backend.model.ChatMessageResponse;
import com.quiethelp.backend.model.MessagesExpiredPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

// Service for handling chat operations: broadcasting messages and managing Redis storage
// All messages expire 30 minutes after creation; enforced by getChatHistory filter and scheduled cleanup.
@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private static final String REDIS_MESSAGE_KEY = "chat:messages";
    private static final String REDIS_ROOM_MESSAGE_KEY_PREFIX = "chat:room:";
    private static final int MAX_MESSAGES = 100;
    /** Message lifetime in minutes; after this, messages are excluded from fetch and removed by cleanup. */
    private static final int MESSAGE_EXPIRY_MINUTES = 30;
    /** Redis key TTL (slightly longer than message expiry so cleanup can run). */
    private static final int KEY_TTL_MINUTES = 35;

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
            long now = Instant.now().toEpochMilli();
            long expiresAt = now + TimeUnit.MINUTES.toMillis(MESSAGE_EXPIRY_MINUTES);

            // Create response with timestamp and expiry
            ChatMessageResponse response;
            if (isRoomChat) {
                response = new ChatMessageResponse(
                    finalUsername,
                    messageDTO.getMessage().trim(),
                    now,
                    messageDTO.getRoomId(),
                    senderSessionId
                );
                response.setChatType(ChatMessageResponse.CHAT_TYPE_PEER);
            } else {
                response = new ChatMessageResponse(
                    finalUsername,
                    messageDTO.getMessage().trim(),
                    now
                );
                response.setChatType(ChatMessageResponse.CHAT_TYPE_GLOBAL);
                if (senderSessionId != null && !senderSessionId.trim().isEmpty()) {
                    response.setSenderSessionId(senderSessionId);
                }
            }
            response.setCreatedAt(now);
            response.setExpiresAt(expiresAt);

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
            
            redisTemplate.expire(redisKey, KEY_TTL_MINUTES, TimeUnit.MINUTES);
            
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
    
    // Retrieves chat history from Redis; returns ONLY non-expired messages.
    // If roomId is provided, retrieves room-specific history; otherwise retrieves broadcast history.
    public List<ChatMessageResponse> getChatHistory(String roomId) {
        try {
            String redisKey = (roomId != null && !roomId.trim().isEmpty())
                ? REDIS_ROOM_MESSAGE_KEY_PREFIX + roomId
                : REDIS_MESSAGE_KEY;

            List<String> messageJsonList = redisTemplate.opsForList().range(redisKey, 0, -1);

            if (messageJsonList == null || messageJsonList.isEmpty()) {
                return new ArrayList<>();
            }

            long now = Instant.now().toEpochMilli();
            List<ChatMessageResponse> messages = new ArrayList<>();
            for (String messageJson : messageJsonList) {
                try {
                    ChatMessageResponse message = objectMapper.readValue(messageJson, ChatMessageResponse.class);
                    // Only return messages that are not yet expired (backend is source of truth)
                    if (message.getExpiresAt() <= 0 || message.getExpiresAt() > now) {
                        messages.add(message);
                    }
                } catch (JsonProcessingException e) {
                    logger.warn("Error deserializing message from Redis: {}", e.getMessage());
                }
            }

            logger.debug("Retrieved {} non-expired messages from Redis key: {}", messages.size(), redisKey);
            return messages;
        } catch (Exception e) {
            logger.error("Error retrieving chat history from Redis: {}", e.getMessage(), e);
            return new ArrayList<>();
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

    /**
     * Runs message expiry: removes messages where expiresAt <= now from Redis and
     * broadcasts messagesExpired so clients can remove them from the UI.
     * Called by the scheduled job.
     */
    public void runExpiryCleanup() {
        long now = Instant.now().toEpochMilli();
        try {
            // Process global chat
            processExpiryForKey(REDIS_MESSAGE_KEY, null, now);
            // Process all room keys
            Set<String> keys = redisTemplate.keys(REDIS_ROOM_MESSAGE_KEY_PREFIX + "*");
            if (keys != null) {
                for (String redisKey : keys) {
                    String roomId = redisKey.substring(REDIS_ROOM_MESSAGE_KEY_PREFIX.length());
                    processExpiryForKey(redisKey, roomId, now);
                }
            }
        } catch (Exception e) {
            logger.error("Error during message expiry cleanup: {}", e.getMessage(), e);
        }
    }

    private void processExpiryForKey(String redisKey, String roomId, long now) {
        try {
            List<String> messageJsonList = redisTemplate.opsForList().range(redisKey, 0, -1);
            if (messageJsonList == null || messageJsonList.isEmpty()) return;

            List<ChatMessageResponse> kept = new ArrayList<>();
            List<Long> expiredTimestamps = new ArrayList<>();
            for (String messageJson : messageJsonList) {
                try {
                    ChatMessageResponse message = objectMapper.readValue(messageJson, ChatMessageResponse.class);
                    if (message.getExpiresAt() > 0 && message.getExpiresAt() <= now) {
                        expiredTimestamps.add(message.getTimestamp());
                    } else {
                        kept.add(message);
                    }
                } catch (JsonProcessingException e) {
                    kept.add(null); // keep malformed entries to avoid index shift; or skip
                }
            }
            // Remove nulls from kept (malformed)
            kept = kept.stream().filter(m -> m != null).collect(Collectors.toList());

            if (expiredTimestamps.isEmpty()) return;

            // Replace list with non-expired only
            redisTemplate.delete(redisKey);
            for (ChatMessageResponse message : kept) {
                try {
                    String json = objectMapper.writeValueAsString(message);
                    redisTemplate.opsForList().rightPush(redisKey, json);
                } catch (JsonProcessingException e) {
                    logger.warn("Error serializing message during cleanup: {}", e.getMessage());
                }
            }
            if (!kept.isEmpty()) {
                redisTemplate.opsForList().trim(redisKey, -MAX_MESSAGES, -1);
                redisTemplate.expire(redisKey, KEY_TTL_MINUTES, TimeUnit.MINUTES);
            }

            // Broadcast so clients remove these messages from UI
            String topic = (roomId != null && !roomId.isEmpty())
                ? "/topic/chat/" + roomId
                : "/topic/chat";
            MessagesExpiredPayload payload = new MessagesExpiredPayload(roomId, expiredTimestamps);
            messagingTemplate.convertAndSend(topic, payload);
            logger.debug("Expired {} messages for key {}; broadcast to {}", expiredTimestamps.size(), redisKey, topic);
        } catch (Exception e) {
            logger.warn("Error processing expiry for key {}: {}", redisKey, e.getMessage());
        }
    }
}
