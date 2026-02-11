package com.quiethelp.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quiethelp.backend.model.ChatMessageResponse;
import com.quiethelp.backend.model.MessagesExpiredPayload;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ChatServiceTest {

    private RedisTemplate<String, String> redisTemplate;
    private SimpMessagingTemplate messagingTemplate;
    private ChatService chatService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        redisTemplate = mock(RedisTemplate.class);
        messagingTemplate = mock(SimpMessagingTemplate.class);
        chatService = new ChatService();
        setField(chatService, "redisTemplate", redisTemplate);
        setField(chatService, "messagingTemplate", messagingTemplate);
        setField(chatService, "objectMapper", objectMapper);
        setField(chatService, "usernameService", mock(UsernameService.class));
    }

    private static void setField(Object target, String name, Object value) throws Exception {
        var f = ChatService.class.getDeclaredField(name);
        f.setAccessible(true);
        f.set(target, value);
    }

    @Test
    void getChatHistory_filtersOutExpiredMessages() throws Exception {
        long now = Instant.now().toEpochMilli();
        long past = now - 60_000;
        long future = now + 10_000;

        ChatMessageResponse expired = new ChatMessageResponse("u1", "m1", past);
        expired.setCreatedAt(past);
        expired.setExpiresAt(past + 1);
        ChatMessageResponse valid = new ChatMessageResponse("u2", "m2", now);
        valid.setCreatedAt(now);
        valid.setExpiresAt(future);

        List<String> stored = List.of(
            objectMapper.writeValueAsString(expired),
            objectMapper.writeValueAsString(valid)
        );

        ListOperations<String, String> listOps = mock(ListOperations.class);
        when(redisTemplate.opsForList()).thenReturn(listOps);
        when(listOps.range("chat:messages", 0, -1)).thenReturn(stored);

        List<ChatMessageResponse> result = chatService.getChatHistory(null);

        assertEquals(1, result.size());
        assertEquals("m2", result.get(0).getMessage());
        assertTrue(result.get(0).getExpiresAt() > now);
    }

    @Test
    void runExpiryCleanup_removesExpiredAndBroadcasts() throws Exception {
        long now = Instant.now().toEpochMilli();
        long past = now - 60_000;

        ChatMessageResponse expired = new ChatMessageResponse("u1", "m1", past);
        expired.setCreatedAt(past);
        expired.setExpiresAt(past + 1);
        ChatMessageResponse valid = new ChatMessageResponse("u2", "m2", now);
        valid.setCreatedAt(now);
        valid.setExpiresAt(now + 600_000);

        List<String> stored = List.of(
            objectMapper.writeValueAsString(expired),
            objectMapper.writeValueAsString(valid)
        );

        ListOperations<String, String> listOps = mock(ListOperations.class);
        when(redisTemplate.opsForList()).thenReturn(listOps);
        when(redisTemplate.keys("chat:room:*")).thenReturn(Collections.emptySet());
        when(listOps.range("chat:messages", 0, -1)).thenReturn(stored);

        chatService.runExpiryCleanup();

        verify(redisTemplate).delete("chat:messages");
        verify(messagingTemplate).convertAndSend(eq("/topic/chat"), any(MessagesExpiredPayload.class));
    }
}
