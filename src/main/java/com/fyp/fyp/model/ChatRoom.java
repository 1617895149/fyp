package com.fyp.fyp.model;


import lombok.Data;

import java.util.List;


@Data
public class ChatRoom {
    private String chatRoomId;
    private String customerId;
    private String agentId;
    private String createdAt;
    private String expiresAt;
    private List<ChatMessage> messages;


    @Override
    public String toString() {
        return "{"
                + "\"chatRoomId\":\"" + chatRoomId + "\","
                + "\"customerId\":\"" + customerId + "\","
                + "\"agentId\":\"" + agentId + "\","
                + "\"createdAt\":\"" + createdAt + "\","
                + "\"expiresAt\":\"" + expiresAt + "\","
                + "\"messages\":" + messages.toString() // 如果 messages 是 List<ChatMessage>，也需要重写 ChatMessage 的 toString 方法
                + "}";
    }
} 
