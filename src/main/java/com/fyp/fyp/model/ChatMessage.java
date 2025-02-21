package com.fyp.fyp.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String chatRoomId;
    private String senderId;
    private String content;
    private LocalDateTime timestamp;
    private String senderRole;
} 