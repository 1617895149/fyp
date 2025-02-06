
// src/test/java/com/fyp/fyp/controller/ChatControllerTest.java



import com.fyp.fyp.controller.ChatController;
import com.fyp.fyp.dto.ChatMessage;
import com.fyp.fyp.dto.ChatRoom;
import com.fyp.fyp.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;


import static org.mockito.Mockito.*;

class ChatControllerTest {

    @InjectMocks
    private ChatController chatController;

    @Mock
    private ChatService chatService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSend() {
        ChatMessage message = new ChatMessage();
        // 设置消息内容
        message.setContent("Hello");

        // 调用 send 方法
        chatController.send(message);

        // 验证 chatService.handleMessage 被调用
        verify(chatService, times(1)).handleMessage(message);
    }

    @Test
    void testCreateChatRoom() {
        String customerId = "2";
        String agentId = "3";
        ChatRoom chatRoom = new ChatRoom();
        // 设置 ChatRoom 的属性
        when(chatService.createChatRoom(customerId, agentId)).thenReturn(chatRoom);

        // 调用 createChatRoom 方法
        ResponseEntity<ChatRoom> response = chatController.createChatRoom(customerId, agentId);

        // 验证返回值和 chatService.createChatRoom 的调用
        verify(chatService, times(1)).createChatRoom(customerId, agentId);
        System.out.println("qqqq" + chatRoom.getChatRoomId());
        assert response.getStatusCode().is2xxSuccessful();
        assert response.getBody() == chatRoom;
    }
}
