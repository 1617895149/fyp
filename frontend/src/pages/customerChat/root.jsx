import { useState, useEffect, useRef } from 'react';
import MessageBubble from '../chat/components/MessageBubble';
import MessageInput from '../chat/components/MessageInput';
import WebSocketService from '../../services/websocket';

export default function CustomerChatRoot() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const userId = '2';  // 测试用固定ID
      
      // 先连接WebSocket
      await WebSocketService.connect(userId, 'ROLE_CUSTOMER');
      setIsConnected(true);

      // 然后创建聊天室
      const response = await fetch('http://localhost:8080/api/chat/room?customerId=2&agentId=3', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('创建聊天室失败');
      }

      const chatRoom = await response.json();
      
      // 设置消息处理器
      WebSocketService.setMessageHandler((message) => {
        setMessages(prev => [...prev, message]);
      });

    } catch (error) {
      console.error('初始化聊天失败:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content) => {
    if (!isConnected) return;

    const message = {
      chatRoomId: '2_3', // 应该从chatRoom中获取
      senderId: '2',
      content,
      timestamp: new Date().toISOString(),
      senderRole: 'ROLE_CUSTOMER',
      type: 'text'
    };

    WebSocketService.sendMessage(message);
    setMessages(prev => [...prev, message]);
  };

  const handleSendFile = (file) => {
    if (!isConnected) return;

    const message = {
      chatRoomId: '2_3',
      senderId: sessionStorage.getItem('userId'),
      content: file.name,
      timestamp: new Date().toISOString(),
      senderRole: 'ROLE_CUSTOMER',
      type: 'file',
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`
    };

    WebSocketService.sendMessage(message);
    setMessages(prev => [...prev, message]);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 头部 */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-lg font-medium text-gray-900">
          在线客服
        </h1>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCustomer={message.senderRole === 'ROLE_CUSTOMER'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t">
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
        />
      </div>

      {/* 连接状态提示 */}
      {!isConnected && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
          连接已断开，正在重新连接...
        </div>
      )}
    </div>
  );
} 