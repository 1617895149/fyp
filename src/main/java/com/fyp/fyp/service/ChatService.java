package com.fyp.fyp.service;

<<<<<<< HEAD
import java.util.List;

import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;

public interface ChatService {
    public ChatRoom createChatRoom(String userId);
    public List<ChatRoom> getAllChatRooms();
    public void handleMessage(ChatMessage message);
}
=======
import com.fyp.fyp.dto.ChatMessage;
import com.fyp.fyp.dto.ChatRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    
    private static final long CHAT_TIMEOUT = 300000; // 5分钟

    public void handleMessage(ChatMessage message) {
        String chatRoomId = message.getChatRoomId();
        String redisKey = "chatroom:" + chatRoomId;
        
        // 更新过期时间
        redisTemplate.expire(redisKey, CHAT_TIMEOUT, TimeUnit.MILLISECONDS);
        
        // 保存消息
        String messageId = "message:" + System.currentTimeMillis();
        redisTemplate.opsForHash().put(redisKey, messageId, message);
        
        // 发送消息给接收方
        String destination = message.getSenderRole().equals("ROLE_CUSTOMER") 
            ? "/queue/agent." + message.getChatRoomId()
            : "/queue/customer." + message.getChatRoomId();
            
        messagingTemplate.convertAndSend(destination, message);
    }

    public ChatRoom createChatRoom(String customerId, String agentId) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomId(customerId + "_" + agentId);
        chatRoom.setCustomerId(customerId);
        chatRoom.setAgentId(agentId);
        chatRoom.setCreatedAt(LocalDateTime.now().toString());
        chatRoom.setExpiresAt(LocalDateTime.now().plusMinutes(5).toString());
        
        String redisKey = "chatroom:" + chatRoom.getChatRoomId();
        redisTemplate.opsForValue().set(redisKey, chatRoom, CHAT_TIMEOUT, TimeUnit.MILLISECONDS);
        
        return chatRoom;
    }
} 
>>>>>>> 9d013e9f83b7fbdc497e41665e5ee3cf6c57851b
