package com.fyp.fyp.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    private String chatRoomId;
    private String customerId;
    private String agentId;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private List<ChatMessage> messages = new ArrayList<>();
} 