package com.fyp.fyp.ws;

import com.fyp.fyp.model.ChatRoom;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {
    
    private final SimpMessagingTemplate messagingTemplate;

    public CustomHandshakeHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    protected Principal determineUser(ServerHttpRequest request, 
                                    WebSocketHandler wsHandler, 
                                    Map<String, Object> attributes) {
        String userId = (String) attributes.get("userId");
        String userRole = (String) attributes.get("userRole");
        
        // 如果是客户且存在聊天室信息，发送给客户端
        if ("ROLE_CUSTOMER".equals(userRole)) {
            ChatRoom chatRoom = (ChatRoom) attributes.get("chatRoom");
            if (chatRoom != null) {
                // 发送聊天室信息到客户端的个人通道
                messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/chatroom/" + userId,  // 修改这里，使用userId作为通道
                    chatRoom
                );
            }
        }
        
        return new StompPrincipal(userId, userRole);
    }
} 