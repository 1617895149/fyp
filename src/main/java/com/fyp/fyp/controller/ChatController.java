package com.fyp.fyp.controller;

<<<<<<< HEAD
import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;
=======
import com.fyp.fyp.dto.ChatMessage;
import com.fyp.fyp.dto.ChatRoom;
import com.fyp.fyp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
>>>>>>> 9d013e9f83b7fbdc497e41665e5ee3cf6c57851b

@RestController
@RequiredArgsConstructor
public class ChatController {
<<<<<<< HEAD
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    
    @Autowired
    private final ChatService chatService;

    @MessageMapping("/send")
    public void send(ChatMessage message, WebSocketSession wsSession) {
        message.setChatRoomId(wsSession.getAttributes().get("chatRoomId").toString());
        message.setSenderId(wsSession.getAttributes().get("userId").toString());
        message.setSenderRole(wsSession.getAttributes().get("userRole").toString());
        chatService.handleMessage(message);
        String destination = "/queue/messages/" + message.getChatRoomId();
        simpMessagingTemplate.convertAndSend(destination, message);
    }

    @PostMapping("/api/chat/createRoom")
    public ResponseEntity<ChatRoom> createChatRoom(HttpSession session) {
        return ResponseEntity.ok(chatService.createChatRoom(session.getAttribute("userId").toString()));
    }

    @GetMapping("/api/chat/getRoom")
    public ResponseEntity<List<ChatRoom>> getChatRoom(HttpSession session) {
        List<ChatRoom> chatRooms = chatService.getAllChatRooms();
        return ResponseEntity.ok(chatRooms);
    }
    //String destination = "/queue/messages/" + message.getChatRoomId();
=======

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
>>>>>>> 9d013e9f83b7fbdc497e41665e5ee3cf6c57851b
}
