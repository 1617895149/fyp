package com.fyp.fyp.controller;

import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;
import com.fyp.fyp.ws.StompPrincipal;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * WebSocket消息处理
     * @param message 聊天消息
     * @param principal 用户身份信息
     */
    @MessageMapping("/send")
    public ChatMessage handleMessage(@Payload ChatMessage message, Principal principal) {
        try {
            StompPrincipal stompPrincipal = (StompPrincipal) principal;
            
            // 设置发送者信息
            message.setSenderId(stompPrincipal.getUserId());
            message.setSenderRole(stompPrincipal.getUserRole());
            message.setTimestamp(LocalDateTime.now());
            
            // 处理消息
            chatService.handleMessage(message);
            
            // 发送消息到指定的聊天室
            messagingTemplate.convertAndSend(
                "/queue/messages/" + message.getChatRoomId(), 
                message
            );
            
            log.info("消息已发送到聊天室: {}", message.getChatRoomId());
            return message;
        } catch (Exception e) {
            log.error("处理消息时发生错误", e);
            throw new RuntimeException("消息处理失败", e);
        }
    }

    /**
     * 创建新的聊天室
     * @param authentication 用户认证信息
     * @return 新创建的聊天室
     */
    @PostMapping("/createRoom")  //Authentication authentication
    public ResponseEntity<ChatRoom> createChatRoom(HttpSession session) {
        try {
            String userId = session.getAttribute("userId").toString();
            ChatRoom chatRoom = chatService.createChatRoom(userId);
            return ResponseEntity.ok(chatRoom);
        } catch (Exception e) {
            log.error("创建聊天室失败", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取所有聊天室
     * @return 聊天室列表
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms() {
        try {
            List<ChatRoom> chatRooms = chatService.getAllChatRooms();
            return ResponseEntity.ok(chatRooms);
        } catch (Exception e) {
            log.error("获取聊天室列表失败", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 根据ID获取聊天室
     * @param id 聊天室ID
     * @return 聊天室信息
     */
    @GetMapping("/room")
    public ResponseEntity<List<ChatRoom>> getChatRoomById(HttpSession session) {
        try {
            List<ChatRoom> chatRoom = chatService.getChatRoomById(session.getAttribute("userId").toString(), session.getAttribute("userRole").toString());
            if (chatRoom != null) {
                return ResponseEntity.ok(chatRoom);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取聊天室失败, id: {}", session.getAttribute("userId").toString(), e);
            return ResponseEntity.badRequest().build();
        }
    }
} 