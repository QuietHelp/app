package com.quiethelp.backend.service;

import com.quiethelp.backend.model.MatchFound;
import com.quiethelp.backend.model.MoodType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

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

    public void joinMatchQueue(String sessionId, MoodType mood) {
        String queueKey = QUEUE_PREFIX + mood.name();
        
        // Check if there's someone waiting
        String peerSessionId = redisTemplate.opsForList().rightPop(queueKey);
        
        if (peerSessionId != null) {
            // Match found!
            String roomId = UUID.randomUUID().toString();
            
            // Store room mappings with TTL
            redisTemplate.opsForValue().set(
                SESSION_ROOM_PREFIX + sessionId, 
                roomId, 
                TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            redisTemplate.opsForValue().set(
                SESSION_ROOM_PREFIX + peerSessionId, 
                roomId, 
                TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            
            // Store room info
            redisTemplate.opsForValue().set(
                ROOM_PREFIX + roomId, 
                sessionId + ":" + peerSessionId, 
                TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            
            // Notify both users
            MatchFound match1 = new MatchFound(roomId, peerSessionId);
            MatchFound match2 = new MatchFound(roomId, sessionId);
            
            messagingTemplate.convertAndSend("/topic/match/" + sessionId, match1);
            messagingTemplate.convertAndSend("/topic/match/" + peerSessionId, match2);
            
            metricsService.recordEvent("MATCH_FOUND", sessionId, Map.of("roomId", roomId, "peerSessionId", peerSessionId));
            metricsService.recordEvent("MATCH_FOUND", peerSessionId, Map.of("roomId", roomId, "peerSessionId", sessionId));
        } else {
            // No match yet, add to queue
            redisTemplate.opsForList().leftPush(queueKey, sessionId);
            redisTemplate.expire(queueKey, TTL_MINUTES, TimeUnit.MINUTES);
            
            metricsService.recordEvent("MATCH_JOINED", sessionId, Map.of("mood", mood.name()));
        }
    }
}

