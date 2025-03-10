package com.fyp.fyp.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

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
    
    // 添加最后在线时间字段
    private Map<String, LocalDateTime> lastOnlineTime = new HashMap<>();
} 