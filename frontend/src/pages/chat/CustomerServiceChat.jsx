import React, { useState, useEffect } from 'react'
import Contact from './components/Contact'
import ChatInput from './components/ChatInput'
import MessageBubble from './components/MessageBubble'
import { FiSearch, FiMessageSquare } from 'react-icons/fi'
import { Client } from '@stomp/stompjs'
import LoadingSpinner from './components/LoadingSpinner'

export default function CustomerServiceChat() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [agentId, setAgentId] = useState('2'); // Assuming a default agentId
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const handleSelectCustomer = async (customerId, chatRoomId, unreadMessages) => {
    try {
      console.log('aaaaaaaaaaaa')
      setSelectedCustomer(customerId);
      setUnreadCount(unreadMessages);

      // 获取聊天记录
      const response = await fetch(`/api/chat/room?chatRoomId=${chatRoomId}`);
      if (!response.ok) {
        throw new Error('获取聊天记录失败');
      }
      const chatRoom = await response.json();
      setMessages(chatRoom[0].messages || []);
      console.log('chatRoom:', chatRoom[0].messages);

      console.log('unreadMessages:', stompClient && unreadMessages > 0);
      // 通过WebSocket发送已读消息通知
      if (unreadMessages > 0) {
        console.log('unreadMessages:', unreadMessages);
        stompClient.publish({
          destination: '/app/markAsRead',
          body: JSON.stringify({
            chatRoomId: chatRoomId,
            agentId: agentId
          })
        });

        // 更新本地联系人列表中的未读消息数
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.chatRoomId === chatRoomId 
              ? { ...contact, numOfUnReadMessage: 0 }
              : contact
          )
        );
      }
    } catch (error) {
      console.error('选择聊天失败:', error);
    }
  };

  // 处理发送消息
  const handleSendMessage = async (content) => {
    if (!selectedCustomer || !stompClient) return;

    const currentChatRoomId = contacts.find(c => c.customerId === selectedCustomer)?.chatRoomId;
    if (!currentChatRoomId) {
      setShowExpiredModal(true);
      return;
    }

    const message = {
      chatRoomId: currentChatRoomId,
      content,
      type: 'text'
    };

    try {
      setLoading(true);
      stompClient.publish({
        destination: '/app/send',
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      setShowExpiredModal(true);
    }
  };

  // 处理收到新消息
  const handleNewMessage = (chatRoomId, newMessage) => {
    console.log(111 + selectedCustomer);
    // 如果是当前选中的聊天室，直接添加消息
    if (selectedCustomer && contacts.find(c => 
      c.chatRoomId === chatRoomId && c.customerId === selectedCustomer
    )) {
      setMessages(prev => [...prev, newMessage]);
      setLoading(false);
    }

    // 更新联系人列表中的最后一条消息
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.chatRoomId === chatRoomId) {
          return {
            ...contact,
            lastMessage: newMessage.content,
            lastMessageTime: newMessage.timestamp,
            numOfUnReadMessage: contact.customerId === selectedCustomer 
              ? contact.numOfUnReadMessage 
              : contact.numOfUnReadMessage + 1
          };
        }
        return contact;
      })
    );
  };

  // 修改订阅函数
  const subscribeToRooms = (client, chatRooms) => {
    chatRooms.forEach(contact => {
      client.subscribe(
        `/queue/messages/${contact.chatRoomId}`,
        message => {
          const newMessage = JSON.parse(message.body);
          handleNewMessage(contact.chatRoomId, newMessage);
        }
      );
      console.log(`已订阅聊天室: ${contact.chatRoomId}`);
    });
  };

  // 修改 handleConnect 函数
  const handleConnect = async () => {
    try {
      const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        connectHeaders: {
          userId: agentId,
          userRole: 'ROLE_CUSTOMER_SERVICE'
        },
        onConnect: () => {
          console.log('WebSocket connected');
          // 连接成功后订阅所有聊天室
          subscribeToRooms(client, contacts);
          
          // 更新在线状态
          fetch('/api/chat/updateOnlineStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ agentId })
          });
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          // 更新离线状态
          fetch('/api/chat/updateOnlineStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ agentId })
          });
        }
      });

      setStompClient(client);
      await client.activate();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  };

  useEffect(() => {
    // 先获取联系人列表，再建立WebSocket连接
    const initializeChat = async () => {
      try {
        // 1. 获取联系人列表
        const response = await fetch('/api/chat/agent/contacts');
        if (!response.ok) {
          throw new Error('获取联系人列表失败');
        }
        const contactList = await response.json();
        setContacts(contactList);
        
        // 2. 建立WebSocket连接
        await handleConnect();
        
      } catch (error) {
        console.error('初始化聊天失败:', error);
      }
    };

    initializeChat();
    
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* 左侧联系人列表 */}
      <div className='w-1/4 bg-white border-r border-gray-200'>
        {/* 搜索栏 */}
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索聊天..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* 联系人列表 */}
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {contacts.map(contact => (
            <Contact 
              key={contact.chatRoomId}
              customerId={contact.customerId}
              chatRoomId={contact.chatRoomId}
              active={selectedCustomer === contact.customerId}
              lastMessage={contact.lastMessage} 
              time={contact.lastMessageTime} 
              unread={contact.numOfUnReadMessage}
              onSelect={() => handleSelectCustomer(
                contact.customerId, 
                contact.chatRoomId,
                contact.numOfUnReadMessage
              )}
            />
          ))}
        </div>
      </div>

      {/* 右侧聊天区域 */}
      <div className='flex-1 flex flex-col bg-gray-50'>
        {selectedCustomer ? (
          <>
            <div className='bg-white p-4 border-b border-gray-200 sticky top-0 z-10'>
              <h2 className="text-lg font-semibold">客户 #{selectedCustomer}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                // 计算是否是未读消息
                const isUnread = unreadCount > 0 && 
                  index >= messages.length - unreadCount &&
                  message.senderRole === 'ROLE_CUSTOMER';

                return (
                  <MessageBubble
                    key={index}
                    message={message}
                    isCustomer={message.senderRole === 'ROLE_CUSTOMER'}
                    isUnread={isUnread}
                  />
                );
              })}
            </div>

            <div className="border-t border-gray-200 bg-white">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FiMessageSquare size={64} className="mb-4" />
            <p className="text-lg">选择一个客户开始聊天</p>
            <p className="text-sm mt-2">从左侧列表选择一个客户进行对话</p>
          </div>
        )}

        {/* 加载动画 */}
        {loading && <LoadingSpinner />}

        {/* 聊天室过期提示 */}
        {showExpiredModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">聊天室已过期</h3>
              <p className="mb-4">该聊天室已不存在，请重新加载页面。</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-500 text-white py-2 rounded-lg"
              >
                确定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
