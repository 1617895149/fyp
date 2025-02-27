package com.fyp.fyp.ws;

import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import lombok.extern.slf4j.Slf4j;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@Slf4j
public class HttpHandshakeInterceptor implements HandshakeInterceptor {
    private final ChatService chatService;
    private ChatRoom chatRoom;

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
                
                log.info("WebSocket握手开始 - userId: {}, userRole: {}", userId, userRole);
                
                if (userId == null || userRole == null) {
                    log.warn("用户信息不完整");
                    return false;
                }
                
                attributes.put("userId", userId);
                attributes.put("userRole", userRole);

                if ("ROLE_CUSTOMER".equals(userRole)) {
                    chatRoom = chatService.createChatRoom(userId);
                    attributes.put("chatRoom", chatRoom);
                    log.info("已创建聊天室: {}", chatRoom.getChatRoomId());
                }
                return true;
            } catch (Exception e) {
                log.error("握手过程中发生错误", e);
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
    }
} 