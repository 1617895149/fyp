package com.fyp.fyp.service.impl;

import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;
import com.fyp.fyp.utils.ChatRedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRedisUtil chatRedisUtil;

    @Autowired
    public ChatServiceImpl(ChatRedisUtil chatRedisUtil) {
        this.chatRedisUtil = chatRedisUtil;
    }

    /**
     * 创建新的聊天室
     * 每个客户只能有一个活跃的聊天室
     * @param customerId 客户ID
     * @return 新创建的聊天室或已存在的聊天室
     */
    @Override
    public ChatRoom createChatRoom(String customerId) {
        // 检查客户是否已有聊天室
        List<ChatRoom> existingRooms = chatRedisUtil.getChatRoomsByUserId(customerId);
        if (!existingRooms.isEmpty()) {
            // 如果已有聊天室，返回第一个聊天室
            ChatRoom existingRoom = existingRooms.get(0);
            log.info("客户已有聊天室, id: {}", existingRoom.getChatRoomId());
            return existingRoom;
        }

        // 固定客服ID为"2"
        String agentId = "2";
        // 生成聊天室ID：customerId:agentId
        String chatRoomId = generateChatRoomId(customerId, agentId);
        
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomId(chatRoomId);
        chatRoom.setCustomerId(customerId);
        chatRoom.setAgentId(agentId);
        chatRoom.setCreatedAt(LocalDateTime.now());
        chatRoom.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        
        chatRedisUtil.createChatRoom(chatRoom);
        log.info("新聊天室已创建, id: {}", chatRoomId);
        
        return chatRoom;
    }

    @Override
    public List<ChatRoom> getChatRoomById(String id, String userRole) {
        try {
            // 根据用户角色确定搜索模式
            String pattern = userRole.equals("ROLE_CUSTOMER") ? 
                String.format("%s:.*", id) :  // 客户模式：customerId:*
                String.format(".*:%s", id);   // 客服模式：*:agentId

            // 获取所有匹配的聊天室
            return chatRedisUtil.searchChatRoomsByPattern(pattern);
            
        } catch (Exception e) {
            log.error("搜索聊天室失败, id: {}, role: {}", id, userRole, e);
            throw new RuntimeException("搜索聊天室失败", e);
        }
    }


    /**
     * 获取所有聊天室
     * @return 聊天室列表
     */
    @Override
    public List<ChatRoom> getAllChatRooms() {
        return chatRedisUtil.getAllChatRooms();
    }

    /**
     * 处理新消息
     * @param message 聊天消息
     */
    @Override
    public void handleMessage(ChatMessage message) {
        String chatRoomId = message.getChatRoomId();
        ChatRoom chatRoom = chatRedisUtil.getChatRoom(chatRoomId);
        
        if (chatRoom == null) {
            log.error("聊天室不存在: {}", chatRoomId);
            throw new RuntimeException("聊天室不存在");
        }
        
        // 添加消息到聊天室
        chatRoom.getMessages().add(message);
        
        // 更新聊天室
        chatRedisUtil.updateChatRoom(chatRoom);
        
        // 刷新过期时间
        chatRedisUtil.refreshChatRoomExpiration(chatRoomId);
        
        log.info("消息已添加到聊天室: {}", chatRoomId);
    }

    /**
     * 根据ID获取聊天室
     * @param id 聊天室ID
     * @return 聊天室信息
     */
    public ChatRoom getChatRoomById(String id) {
        return chatRedisUtil.getChatRoom(id);
    }

    /**
     * 生成聊天室ID
     * 格式：customerId:agentId
     */
    private String generateChatRoomId(String customerId, String agentId) {
        return String.format("%s:%s", customerId, agentId);
    }
} 