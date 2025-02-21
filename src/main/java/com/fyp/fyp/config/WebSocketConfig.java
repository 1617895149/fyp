package com.fyp.fyp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.fyp.fyp.ws.CustomHandshakeHandler;
import com.fyp.fyp.ws.HttpHandshakeInterceptor;
import com.fyp.fyp.service.ChatService;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketConfig(ChatService chatService, @Lazy SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue", "/user");
        config.setApplicationDestinationPrefixes("/chat");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setHandshakeHandler(new CustomHandshakeHandler(messagingTemplate))
                .addInterceptors(new HttpHandshakeInterceptor(chatService))
                .setAllowedOrigins("http://localhost:5173");
    }
} 