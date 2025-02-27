package com.fyp.fyp.service;

import java.util.List;

import com.fyp.fyp.model.ChatMessage;
import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.dto.ContactDTO;

public interface ChatService {
    public ChatRoom createChatRoom(String userId);
    public List<ChatRoom> getAllChatRooms();
    public void handleMessage(ChatMessage message);
    public List<ChatRoom> getChatRoomById(String id, String userRole);
    
}