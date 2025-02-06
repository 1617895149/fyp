import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws', null, { 
      transports: ['websocket'],
      withCredentials: true 
    });
    const newClient = new Client({
      webSocketFactory: () => socket, // 使用 SockJS 实例
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        // 订阅特定聊天室的消息路径
        if (chatRoomId) {
          newClient.subscribe(`/queue/messages/${chatRoomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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
      newClient.deactivate();
    };
  }, [chatRoomId]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'text',
      content: text,
      timestamp: new Date().getTime(),
      isCustomer: true
    };
    setMessages([...messages, newMessage]);

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