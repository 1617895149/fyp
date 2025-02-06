package com.fyp.fyp.dto;

import lombok.Data;


@Data
public class ChatMessage {
    private String chatRoomId;
    private String senderId;
    private String content;
    private String timestamp;
    private String senderRole;
}

