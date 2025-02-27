package com.fyp.fyp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private String chatRoomId;
    private String customerId;
    private String agentId;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Integer numOfUnReadMessage;
    private String lastMessage;  // 添加最后一条消息内容
    private LocalDateTime lastMessageTime;  // 添加最后一条消息时间
} 