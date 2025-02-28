package com.fyp.fyp.service;

import java.util.List;

import com.fyp.fyp.dto.ContactDTO;
import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;


public interface ChatService {
    public ChatRoom createChatRoom(String userId);
    public List<ChatRoom> getAllChatRooms();
    public void handleMessage(ChatMessage message);
    public List<ChatRoom> getChatRoomById(String id, String userRole);
    public void updateAgentOnlineStatus(String agentId);
    public List<ContactDTO> getAgentContacts(String agentId);
    public void markMessagesAsRead(String chatRoomId, String agentId);
}