import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // 添加连接状态标志

  useEffect(() => {
    let isMounted = true;
    let subscription = null; // 用于存储订阅对象

    const fetchChatRoomId = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/chat/getRoom/1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const chatRoom = await response.json();
        if (isMounted) {
          setChatRoomId(chatRoom.chatRoomId);
          console.log("efef" + chatRoom.chatRoomId);
        }
      } catch (error) {
        console.error('Error fetching chat room:', error);
      }
    };

    fetchChatRoomId();

    const socket = new SockJS('http://localhost:8080/ws', null, {
      transports: ['websocket'],
      withCredentials: true
    });

    const newClient = new Client({
      webSocketFactory: () => socket,
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 300000, // 设置心跳时间（5分钟）
      heartbeatOutgoing: 300000, // 设置心跳时间（5分钟）
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        setIsConnected(true); // 设置连接状态为已连接
        if (chatRoomId) {
          subscription = newClient.subscribe(`/queue/messages/${chatRoomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            if (isMounted) {
              setMessages((prevMessages) => [...prevMessages, receivedMessage]);
              console.log("Received message:", receivedMessage); // 打印接收到的消息
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP Error: ' + frame);
      }
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      isMounted = false;
      if (isConnected) { // 只有在连接已建立时才取消订阅和关闭连接
        if (subscription) {
          subscription.unsubscribe(); // 清理订阅
        }
        //newClient.deactivate();
      }
    };
  }, [chatRoomId]);

  const handleSendMessage = (text) => {
    if (!text.trim()) {
      console.warn('Message is empty');
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      type: 'text',
      content: text,
      timestamp: new Date().getTime(),
      isCustomer: true,
      chatRoomId: chatRoomId // 添加 chatRoomId 到消息对象中
    };
    //setMessages([...messages, newMessage]);

    if (client) {
      client.publish({
        destination: '/chat/send',
        body: JSON.stringify(newMessage)
      });
    }
  };

  return (
    <div className="flex flex-col h-[90vh] w-[50%] mx-auto mt-4 bg-white rounded-2xl shadow-xl border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <div className="border-t p-4 bg-white rounded-b-2xl">
        <input
          type="text"
          className="w-full p-2"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}

export default ChatRoom;