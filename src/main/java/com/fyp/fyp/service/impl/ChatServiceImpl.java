package com.fyp.fyp.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;

@Service
public class ChatServiceImpl implements ChatService{
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String CHAT_ROOMS_KEY = "chatrooms";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    private final ReentrantLock lock = new ReentrantLock();

    @Autowired
    public ChatServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public ChatRoom createChatRoom(String userId) {
        lock.lock();
        try {
            HashOperations<String, String, ChatRoom> hashOps = redisTemplate.opsForHash();
            String chatRoomKey = userId + ":" + "2";

            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setCreatedAt(LocalDateTime.now().format(DATE_FORMATTER));
            chatRoom.setMessages(new ArrayList<>());
            chatRoom.setChatRoomId(chatRoomKey);
            chatRoom.setCustomerId(userId);
            chatRoom.setAgentId("2");

            if (hashOps.hasKey(CHAT_ROOMS_KEY, chatRoomKey)) {
                return hashOps.get(CHAT_ROOMS_KEY, chatRoomKey);
            }

            LocalDateTime expiresAt = LocalDateTime.now().plus(5, ChronoUnit.MINUTES);
            chatRoom.setExpiresAt(expiresAt.format(DATE_FORMATTER));

            hashOps.put(CHAT_ROOMS_KEY, chatRoomKey, chatRoom);
            redisTemplate.expire(CHAT_ROOMS_KEY, 5, TimeUnit.MINUTES);

            return chatRoom;
        } finally {
            lock.unlock();
        }
    }

    @Override
    public List<ChatRoom> getAllChatRooms() {
        HashOperations<String, String, ChatRoom> hashOps = redisTemplate.opsForHash();
        Map<String, ChatRoom> entries = hashOps.entries(CHAT_ROOMS_KEY);
        return new ArrayList<>(entries.values());
    }

    @Override
    public void handleMessage(ChatMessage message) {
        String key = message.getChatRoomId() + ":messages";
        redisTemplate.opsForList().leftPush(key, message.toString());
        
        //long count = 1;
//
        // 
        // ScanOptions scanOptions = ScanOptions.scanOptions()
        //         .match(matchPattern)
        //         .count(count)
        //         .build();
//
        //// 使用scan方法
        //try (Cursor<Map.Entry<Object, Object>> cursor = redisTemplate.opsForHash().scan(matchPattern, scanOptions)) {
        //    while (cursor.hasNext()) {
        //        Map.Entry<Object, Object> entry = cursor.next();
        //        System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
        //        List<Object> messageList = ;
        //    }
        //} catch (Exception e) {
        //    e.printStackTrace();
        //}
//

        
    }

    
    
}
