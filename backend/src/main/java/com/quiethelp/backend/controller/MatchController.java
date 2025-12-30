package com.quiethelp.backend.controller;

import com.quiethelp.backend.model.MatchRequest;
import com.quiethelp.backend.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class MatchController {

    @Autowired
    private MatchingService matchingService;

    @MessageMapping("/match.join")
    public void joinMatch(@Payload MatchRequest request) {
        matchingService.joinMatchQueue(request.getSessionId(), request.getMood());
    }
}

