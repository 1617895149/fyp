package com.fyp.fyp.utils;

import com.fyp.fyp.model.ChatRoom;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class ChatRedisUtil {

    // Redis中存储聊天室的Hash key
    private static final String CHAT_ROOMS_KEY = "chatrooms";
    
    // 聊天室过期时间（分钟）
    private static final long CHAT_ROOM_EXPIRE_MINUTES = 5;

    private final HashOperations<String, String, String> hashOperations;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public ChatRedisUtil(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
        
        // 配置ObjectMapper以支持Java 8时间类型
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * 保存聊天室信息到Redis
     * @param chatRoom 聊天室对象
     */
    public void createChatRoom(ChatRoom chatRoom) {
        try {
            String chatRoomJson = objectMapper.writeValueAsString(chatRoom);
            hashOperations.put(CHAT_ROOMS_KEY, chatRoom.getChatRoomId(), chatRoomJson);
            
            // 设置过期时间
            redisTemplate.expire(CHAT_ROOMS_KEY, CHAT_ROOM_EXPIRE_MINUTES, TimeUnit.MINUTES);
            
            log.info("聊天室已保存到Redis, chatRoomId: {}", chatRoom.getChatRoomId());
        } catch (Exception e) {
            log.error("保存聊天室信息失败", e);
            throw new RuntimeException("保存聊天室信息失败", e);
        }
    }

    /**
     * 从Redis获取聊天室信息
     * @param chatRoomId 聊天室ID
     * @return 聊天室对象
     */
    public ChatRoom getChatRoom(String chatRoomId) {
        try {
            String chatRoomJson = hashOperations.get(CHAT_ROOMS_KEY, chatRoomId);
            if (chatRoomJson == null) {
                return null;
            }
            return objectMapper.readValue(chatRoomJson, ChatRoom.class);
        } catch (Exception e) {
            log.error("获取聊天室信息失败", e);
            throw new RuntimeException("获取聊天室信息失败", e);
        }
    }

    /**
     * 获取所有聊天室
     * @return 聊天室列表
     */
    public List<ChatRoom> getAllChatRooms() {
        try {
            // 获取所有聊天室的Map
            Map<String, String> chatRoomsMap = hashOperations.entries(CHAT_ROOMS_KEY);
            if (chatRoomsMap == null || chatRoomsMap.isEmpty()) {
                return new ArrayList<>();
            }

            // 将JSON字符串反序列化为ChatRoom对象
            List<ChatRoom> chatRooms = new ArrayList<>();
            for (String chatRoomJson : chatRoomsMap.values()) {
                chatRooms.add(objectMapper.readValue(chatRoomJson, ChatRoom.class));
            }
            return chatRooms;
        } catch (Exception e) {
            log.error("获取所有聊天室失败", e);
            throw new RuntimeException("获取所有聊天室失败", e);
        }
    }

    /**
     * 检查聊天室是否存在
     * @param chatRoomId 聊天室ID
     * @return 是否存在
     */
    public boolean chatRoomExists(String chatRoomId) {
        return hashOperations.hasKey(CHAT_ROOMS_KEY, chatRoomId);
    }

    /**
     * 更新聊天室信息
     * @param chatRoom 聊天室对象
     */
    public void updateChatRoom(ChatRoom chatRoom) {
        createChatRoom(chatRoom);
    }

    /**
     * 删除聊天室
     * @param chatRoomId 聊天室ID
     */
    public void deleteChatRoom(String chatRoomId) {
        try {
            hashOperations.delete(CHAT_ROOMS_KEY, chatRoomId);
            log.info("聊天室已从Redis删除, chatRoomId: {}", chatRoomId);
        } catch (Exception e) {
            log.error("删除聊天室失败", e);
            throw new RuntimeException("删除聊天室失败", e);
        }
    }

    /**
     * 刷新聊天室过期时间
     * @param chatRoomId 聊天室ID
     */
    public void refreshChatRoomExpiration(String chatRoomId) {
        if (chatRoomExists(chatRoomId)) {
            redisTemplate.expire(CHAT_ROOMS_KEY, CHAT_ROOM_EXPIRE_MINUTES, TimeUnit.MINUTES);
            log.info("聊天室过期时间已刷新, chatRoomId: {}", chatRoomId);
        }
    }

    /**
     * 根据用户ID获取聊天室
     * @param userId 用户ID（可以是客户ID或客服ID）
     * @return 相关的聊天室列表
     */
    public List<ChatRoom> getChatRoomsByUserId(String userId) {
        try {
            List<ChatRoom> result = new ArrayList<>();
            Map<String, String> allRooms = hashOperations.entries(CHAT_ROOMS_KEY);
            
            for (Map.Entry<String, String> entry : allRooms.entrySet()) {
                ChatRoom chatRoom = objectMapper.readValue(entry.getValue(), ChatRoom.class);
                // 检查是否包含指定的用户ID（作为客户或客服）
                if (chatRoom.getCustomerId().equals(userId) || 
                    chatRoom.getAgentId().equals(userId)) {
                    result.add(chatRoom);
                }
            }
            
            return result;
        } catch (Exception e) {
            log.error("根据用户ID获取聊天室失败", e);
            throw new RuntimeException("获取聊天室失败", e);
        }
    }

    /**
     * 根据模式搜索聊天室
     * @param pattern 搜索模式（正则表达式）
     * @return 匹配的聊天室列表
     */
    public List<ChatRoom> searchChatRoomsByPattern(String pattern) {
        try {
            // 获取所有聊天室的key
            Set<String> hashKeys = hashOperations.keys(CHAT_ROOMS_KEY);
            
            // 使用Stream API过滤并获取匹配的聊天室
            return hashKeys.stream()
                .filter(key -> key.matches(pattern))  // 使用正则表达式匹配
                .map(key -> {
                    try {
                        String chatRoomJson = hashOperations.get(CHAT_ROOMS_KEY, key);
                        return objectMapper.readValue(chatRoomJson, ChatRoom.class);
                    } catch (Exception e) {
                        log.error("解析聊天室数据失败, key: {}", key, e);
                        return null;
                    }
                })
                .filter(chatRoom -> chatRoom != null)  // 过滤掉解析失败的数据
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("搜索聊天室失败, pattern: {}", pattern, e);
            throw new RuntimeException("搜索聊天室失败", e);
        }
    }

} 