package com.quiethelp.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    @Autowired
    private MetricsService metricsService;

    public void recordSessionCreated(String sessionId) {
        metricsService.recordEvent("SESSION_CREATED", sessionId, null);
    }
}

