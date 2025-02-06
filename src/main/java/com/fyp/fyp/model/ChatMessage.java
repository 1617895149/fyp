package com.fyp.fyp.model;

import lombok.Data;


@Data
public class ChatMessage {
    private String chatRoomId;
    private String senderId;
    private String content;
    private String timestamp;
    private String senderRole;

    @Override
    public String toString() {
        return "{"
                + "\"chatRoomId\":\"" + chatRoomId + "\","
                + "\"senderId\":\"" + senderId + "\","
                + "\"content\":\"" + content + "\","
                + "\"timestamp\":\"" + timestamp + "\","
                + "\"senderRole\":\"" + senderRole + "\""
                + "}";
    }
}