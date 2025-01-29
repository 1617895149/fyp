package com.fyp.fyp.dto;

import lombok.Data;
import java.util.Map;


@Data
public class ChatRoom {
    private String chatRoomId;
    private String customerId;
    private String agentId;
    private String createdAt;
    private String expiresAt;
    private Map<String, ChatMessage> messages;
} 