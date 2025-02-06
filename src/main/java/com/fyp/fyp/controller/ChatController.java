package com.fyp.fyp.controller;

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

@RestController
@RequiredArgsConstructor
public class ChatController {
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
}
