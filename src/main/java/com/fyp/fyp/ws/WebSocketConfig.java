package com.fyp.fyp.ws;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import com.fyp.fyp.model.ChatRoom;
import com.fyp.fyp.model.Enum.UserRole;
import com.fyp.fyp.service.ChatService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;


import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private ChatService chatService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setApplicationDestinationPrefixes("/chat");
        config.enableSimpleBroker("/queue");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")

                .setAllowedOrigins("http://localhost:5173")
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request,
                            WebSocketHandler wsHandler,
                            Map<String, Object> attributes) {
                        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
                                .getRequestAttributes();
                        HttpServletRequest servletRequest = requestAttributes.getRequest();
                        HttpSession session = servletRequest.getSession(false);
                        Object userRoleObj = session.getAttribute("userRole");
                        String userRole = (userRoleObj != null) ? userRoleObj.toString() : null;

                        String role = UserRole.valueOf(userRole).toString();
                        return new StompPrincipal(role);
                    }
                }).withSockJS();
    }

    @SuppressWarnings("deprecation")
    @Bean
    public TaskScheduler heartBeatScheduler() {
        return new ConcurrentTaskScheduler();
    }

    private static class StompPrincipal implements Principal {
        private final String name;

        StompPrincipal(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }
    }

    public class HttpHandshakeInterceptor implements HandshakeInterceptor {
        ChatRoom chatRoom = new ChatRoom();
        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
            System.out.println("Before Handshake: " + request.getURI());
            if (request instanceof ServletServerHttpRequest) {
                ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                HttpSession session = servletRequest.getServletRequest().getSession(false);
                if (session != null) {
                    Object userRoleObj = session.getAttribute("userRole");
                    String userRole = (userRoleObj != null) ? userRoleObj.toString() : null;
                    System.out.println("User Role: " + userRole);
                    if (userRole == null) {
                        System.out.println("User role is null, cannot proceed with handshake.");
                        return false; // 如果没有用户角色，拒绝握手
                    }
                    if ("ROLE_CUSTOMER".equals(userRole)) {
                        chatRoom = chatService.createChatRoom(session.getAttribute("userId").toString());
                        attributes.put("chatRoomId", chatRoom.getChatRoomId());
                        attributes.put("userRole", userRole);
                        attributes.put("userId", session.getAttribute("userId").toString());
                    }
                } else {
                    System.out.println("Session is null, cannot proceed with handshake.");
                    return false; // 如果没有Session，拒绝握手
                }
            }
            return true;
        }
        
        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                Exception exception) {
            System.out.println("After Handshake: " + request.getURI());
            if (exception != null) {
                System.out.println("Handshake Exception: " + exception.getMessage());
            }
        }

        

    }
}
