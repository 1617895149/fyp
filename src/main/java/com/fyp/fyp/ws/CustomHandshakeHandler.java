package com.fyp.fyp.ws;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;
import java.util.Map;

@Slf4j
public class CustomHandshakeHandler extends DefaultHandshakeHandler {
    
    //private final SimpMessagingTemplate messagingTemplate;

    public CustomHandshakeHandler(SimpMessagingTemplate messagingTemplate) {
        //this.messagingTemplate = messagingTemplate;
    }

    @Override
    protected Principal determineUser(ServerHttpRequest request, 
                                    WebSocketHandler wsHandler, 
                                    Map<String, Object> attributes) {
        String userId = (String) attributes.get("userId");
        String userRole = (String) attributes.get("userRole");
        
        //// 如果是客户且存在聊天室信息，发送给客户端
        //if ("ROLE_CUSTOMER".equals(userRole)) {
        //    ChatRoom chatRoom = (ChatRoom) attributes.get("chatRoom");
        //    if (chatRoom != null) {
        //        log.info("准备发送聊天室信息到客户端, userId: {}, chatRoomId: {}", userId, chatRoom.getChatRoomId());
        //        // 修改发送路径
        //        messagingTemplate.convertAndSend(
        //            "/queue/chatroom/" + userId,  // 移除/user前缀
        //            chatRoom
        //        );
        //        log.info("聊天室信息已发送");
        //    }
        //}
        
        return new StompPrincipal(userId, userRole);
    }
} 