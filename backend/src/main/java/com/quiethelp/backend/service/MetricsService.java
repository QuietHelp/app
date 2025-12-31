package com.quiethelp.backend.service;

import com.quiethelp.backend.model.MetricEvent;
import com.quiethelp.backend.repository.MetricEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MetricsService {

    @Autowired
    private MetricEventRepository repository;

    public void recordEvent(String eventType, String sessionId, Map<String, Object> metadata) {
        MetricEvent event = new MetricEvent();
        event.setEventType(eventType);
        if (metadata != null) {
            // Create a mutable copy to avoid UnsupportedOperationException
            Map<String, Object> mutableMetadata = new HashMap<>(metadata);
            mutableMetadata.put("sessionId", sessionId);
            event.setMetadata(mutableMetadata);
        } else {
            event.setMetadata(Map.of("sessionId", sessionId));
        }
        repository.save(event);
    }
}

