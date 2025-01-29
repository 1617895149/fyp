package com.fyp.fyp.controller;

import com.fyp.fyp.dto.ChatMessage;
import com.fyp.fyp.dto.ChatRoom;
import com.fyp.fyp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void send(ChatMessage message) {
        chatService.handleMessage(message);
    }

    @PostMapping("/api/chat/room")
    public ResponseEntity<ChatRoom> createChatRoom(
            @RequestParam String customerId,
            @RequestParam String agentId) {
        return ResponseEntity.ok(chatService.createChatRoom(customerId, agentId));
    }
}
