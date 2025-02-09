package com.fyp.fyp.controller;

import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;
import com.fyp.fyp.ws.WebSocketConfig.StompPrincipal;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private final ChatService chatService;

    @MessageMapping("/send")
    public void send(@Payload ChatMessage message, Principal principal) {
        //message.setChatRoomId(wsSession.getAttributes().get("chatRoomId").toString());
        if (principal instanceof StompPrincipal){
            StompPrincipal stompPrincipal = (StompPrincipal) principal;
            message.setSenderId(stompPrincipal.getUserId());
            message.setSenderRole(stompPrincipal.getUserRole());
        }
        chatService.handleMessage(message);
        String destination = "/queue/messages/" + message.getChatRoomId();
        simpMessagingTemplate.convertAndSend(destination, message);
    }

    @PostMapping("/api/chat/createRoom")
    public ResponseEntity<ChatRoom> createChatRoom(HttpSession session) {
        return ResponseEntity.ok(chatService.createChatRoom(session.getAttribute("userId").toString()));
    }

    @GetMapping("/api/chat/getRoom")
    public ResponseEntity<List<ChatRoom>> getChatRoom() {
        List<ChatRoom> chatRooms = chatService.getAllChatRooms();
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/api/chat/getRoom/{id}")
    public ResponseEntity<ChatRoom> getChatRoomById(@PathVariable Long id) {
        List<ChatRoom> chatRooms = chatService.getAllChatRooms();
        // 使用 Stream 的 findFirst 方法获取第一个匹配的 ChatRoom
        Optional<ChatRoom> chatRoomOptional = chatRooms.stream()
                .filter(chatRoom -> chatRoom.getCustomerId().equals(id.toString()))
                .findFirst(); // 获取第一个匹配的元素

        // 检查 Optional 是否包含值
        if (chatRoomOptional.isPresent()) {
            return ResponseEntity.ok(chatRoomOptional.get()); // 返回找到的 ChatRoom
        } else {
            return ResponseEntity.notFound().build(); // 如果没有找到，返回 404
        }
    }
}
