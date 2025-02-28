package com.fyp.fyp.ws;

import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.service.ChatService;
import com.fyp.fyp.utils.ChatRedisUtil;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Component
public class HttpHandshakeInterceptor implements HandshakeInterceptor {
    private final ChatService chatService;
    private ChatRoom chatRoom;

    @Autowired
    private ChatRedisUtil chatRedisUtil;

    public HttpHandshakeInterceptor(ChatService chatService) {
        this.chatService = chatService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
        HttpSession session = servletRequest.getServletRequest().getSession();
        // 从请求头获取用户信息
        String userId = session.getAttribute("userId").toString();
        String userRole = session.getAttribute("userRole").toString();

        if (userRole != null && userRole.equals("ROLE_CUSTOMER_SERVICE")) {
            // 更新客服在线时间
            chatRedisUtil.updateAgentLastOnlineTime(userId, LocalDateTime.now());
        }

        // 将用户信息存储在attributes中
        attributes.put("userId", userId);
        attributes.put("userRole", userRole);

        if ("ROLE_CUSTOMER".equals(userRole)) {
            chatRoom = chatService.createChatRoom(userId);
            attributes.put("chatRoom", chatRoom);
            log.info("已创建聊天室: {}", chatRoom.getChatRoomId());
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        // 可以在这里添加连接后的处理逻辑
    }
}