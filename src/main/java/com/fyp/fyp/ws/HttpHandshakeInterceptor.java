package com.fyp.fyp.ws;

import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {

    private final ChatService chatService;

    public HttpHandshakeInterceptor(ChatService chatService) {
        this.chatService = chatService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, 
                                 ServerHttpResponse response, 
                                 WebSocketHandler wsHandler, 
                                 Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            try {
                ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                HttpSession session = servletRequest.getServletRequest().getSession();
                
            String userId = session.getAttribute("userId").toString();
            String userRole = session.getAttribute("userRole").toString();
            
            if (userId == null || userRole == null) {
                return false;
            }
            
            attributes.put("userId", userId);
            attributes.put("userRole", userRole);

            // 如果是客户，创建聊天室并保存到attributes中
            if ("ROLE_CUSTOMER".equals(userRole)) {
                ChatRoom chatRoom = chatService.createChatRoom(userId);
                System.out.println("fffffff");
                attributes.put("chatRoom", chatRoom);
            }
            return true;
            } catch (Exception e) {
                System.out.println("ggggggg");
                System.out.println(e.getMessage());
                return false;
            }
        }
        
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, 
                             ServerHttpResponse response, 
                             WebSocketHandler wsHandler, 
                             Exception exception) {
                                System.out.println("ggggggg");    
    }
} 