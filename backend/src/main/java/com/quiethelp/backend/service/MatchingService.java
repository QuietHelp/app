package com.quiethelp.backend.service;

import com.quiethelp.backend.model.MatchFound;
import com.quiethelp.backend.model.MoodType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import com.quiethelp.backend.model.ChatMessageResponse;

@Service
public class MatchingService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MetricsService metricsService;

    private static final String QUEUE_PREFIX = "queue:mood:";
    private static final String ROOM_PREFIX = "room:";
    private static final String SESSION_ROOM_PREFIX = "session:room:";
    private static final int TTL_MINUTES = 30;

    public void joinMatchQueue(String sessionId, MoodType mood, Integer age, String country) {
        // Validate non-null parameters
        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw new IllegalArgumentException("sessionId cannot be null or empty");
        }
        if (mood == null) {
            throw new IllegalArgumentException("mood cannot be null");
        }
        
        String queueKey = QUEUE_PREFIX + mood.name();
        
        // Check if there's someone waiting
        String peerSessionId = redisTemplate.opsForList().rightPop(queueKey);
        
        if (peerSessionId != null && !peerSessionId.trim().isEmpty()) {
            // Match found!
            String roomId = Objects.requireNonNull(UUID.randomUUID().toString(), "roomId cannot be null");
            final String validatedPeerSessionId = Objects.requireNonNull(peerSessionId, "peerSessionId cannot be null");
            
            // Store room mappings with TTL
            redisTemplate.opsForValue().set(
                SESSION_ROOM_PREFIX + sessionId, 
                roomId, 
                TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            redisTemplate.opsForValue().set(
                SESSION_ROOM_PREFIX + validatedPeerSessionId, 
                roomId, 
                TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            
            // Store room info
            redisTemplate.opsForValue().set(
                ROOM_PREFIX + roomId, 
                sessionId + ":" + validatedPeerSessionId, 
                TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            
            // Notify both users
            MatchFound match1 = new MatchFound(roomId, validatedPeerSessionId);
            MatchFound match2 = new MatchFound(roomId, sessionId);
            
            messagingTemplate.convertAndSend("/topic/match/" + sessionId, match1);
            messagingTemplate.convertAndSend("/topic/match/" + validatedPeerSessionId, match2);
            
            metricsService.recordEvent("MATCH_FOUND", sessionId, Map.of("roomId", roomId, "peerSessionId", validatedPeerSessionId, "age", String.valueOf(age), "country", country));
            metricsService.recordEvent("MATCH_FOUND", validatedPeerSessionId, Map.of("roomId", roomId, "peerSessionId", sessionId));
        } else {
            // No match yet, add to queue
            redisTemplate.opsForList().leftPush(queueKey, sessionId);
            redisTemplate.expire(queueKey, TTL_MINUTES, TimeUnit.MINUTES);
            
            metricsService.recordEvent("MATCH_JOINED", sessionId, Map.of("mood", mood.name(), "age", String.valueOf(age), "country", country));
        }
    }

    // End session for a given sessionId: remove room mappings, delete room, notify both users
    public void endSession(String sessionId) {
        String sessionRoomKey = SESSION_ROOM_PREFIX + sessionId;
        String roomId = redisTemplate.opsForValue().get(sessionRoomKey);
        if (roomId == null) return;

        String roomKey = ROOM_PREFIX + roomId;
        String participants = redisTemplate.opsForValue().get(roomKey);

        // Notify room that session ended
        try {
            ChatMessageResponse sysMsg = new ChatMessageResponse("system", "Session ended.", java.time.Instant.now().toEpochMilli(), roomId, null);
            messagingTemplate.convertAndSend("/topic/chat/" + roomId, sysMsg);
        } catch (Exception e) {
            // ignore
        }

        // Delete Redis keys for room and session mappings
        try {
            redisTemplate.delete(roomKey);
            redisTemplate.delete(sessionRoomKey);
            if (participants != null && participants.contains(":")) {
                String[] parts = participants.split(":", 2);
                String a = parts[0];
                String b = parts[1];
                redisTemplate.delete(SESSION_ROOM_PREFIX + a);
                redisTemplate.delete(SESSION_ROOM_PREFIX + b);
            }

            // Also delete any stored room messages
            redisTemplate.delete("chat:room:" + roomId);
        } catch (Exception e) {
            // ignore
        }
    }

    // Change friend: end current session for this user, then re-join queue with provided params
    public void changeFriend(String sessionId, MoodType mood, Integer age, String country) {
        endSession(sessionId);
        // Re-enqueue user for matching using provided params
        if (mood == null) mood = MoodType.NOT_SURE;
        joinMatchQueue(sessionId, mood, age, country);
    }
}

