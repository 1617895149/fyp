package com.fyp.fyp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;


@Data
public class ChatMessage {
    @JsonProperty("chatRoomId")
    private String chatRoomId;

    @JsonProperty("senderId")
    private String senderId;

    @JsonProperty("content")
    private String content;

    // 使用 ToStringSerializer 将 timestamp 转换为字符串，避免 JSON 序列化问题
    @JsonSerialize(using = ToStringSerializer.class)
    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("senderRole")
    private String senderRole;

    // 无参构造函数
    public ChatMessage() {
    }

    // 有参构造函数（可选，方便创建对象时直接传入参数）
    public ChatMessage(String chatRoomId, String senderId, String content, String timestamp, String senderRole) {
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.senderRole = senderRole;
    }

    @Override
    public String toString() {
        return "{" +
                "\"chatRoomId\":\"" + chatRoomId + "\"," +
                "\"senderId\":\"" + senderId + "\"," +
                "\"content\":\"" + content + "\"," +
                "\"timestamp\":\"" + timestamp + "\"," +
                "\"senderRole\":\"" + senderRole + "\"" +
                "}";
    }
}