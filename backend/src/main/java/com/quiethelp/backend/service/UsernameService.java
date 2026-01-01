package com.quiethelp.backend.service;

import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

// Service for generating anonymous usernames
@Service
public class UsernameService {
    
    private static final AtomicInteger guestCounter = new AtomicInteger(1);
    
    // Generates a unique anonymous username in the format Guest-XXXX
    // Uses a simple counter for readability
    public String generateUsername() {
        int counter = guestCounter.getAndIncrement();
        return "Guest-" + String.format("%04d", counter % 10000);
    }
    // Generates a username from a UUID (fallback method)
    public String generateUsernameFromUUID() {
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return "Guest-" + uuid;
    }
}

