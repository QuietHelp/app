package com.quiethelp.backend.scheduler;

import com.quiethelp.backend.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Runs message expiry cleanup every minute: removes expired messages from Redis
 * and broadcasts messagesExpired so clients can remove them from the UI.
 */
@Component
public class MessageExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MessageExpiryScheduler.class);

    @Autowired
    private ChatService chatService;

    @Scheduled(fixedRate = 60_000) // every 1 minute
    public void runExpiryCleanup() {
        logger.trace("Running message expiry cleanup");
        chatService.runExpiryCleanup();
    }
}
