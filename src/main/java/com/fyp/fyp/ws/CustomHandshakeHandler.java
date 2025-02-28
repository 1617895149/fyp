package com.fyp.fyp.ws;

import com.fyp.fyp.utils.ChatRedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Autowired
    private ChatRedisUtil chatRedisUtil;

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {
        String userId = (String) attributes.get("userId");
        String userRole = (String) attributes.get("userRole");

        // 如果是客服，更新所有相关聊天室的最后在线时间
        if ("ROLE_CUSTOMER_SERVICE".equals(userRole)) {
            chatRedisUtil.updateAgentLastOnlineTime(userId, LocalDateTime.now());
        }

        return new StompPrincipal(userId, userRole);
    }
} 