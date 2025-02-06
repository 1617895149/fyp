import { useState, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import UserListItem from './components/UserListItem';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';

// 模拟数据
const mockUsers = [
  {
    id: 1,
    name: "张三",
    lastMessage: "好的，我知道了",
    lastMessageTime: new Date().getTime() - 1000 * 60 * 5,
    unreadCount: 2
  },
  // ... 更多用户
];

const mockMessages = [
  {
    id: 1,
    type: 'text',
    content: "您好，请问有什么可以帮您？",
    timestamp: new Date().getTime() - 1000 * 60 * 10,
    isCustomer: false
  },
  // ... 更多消息
];

export default function ChatRoot() {
  const [users, setUsers] = useState(mockUsers);
  const [messages, setMessages] = useState(mockMessages);
  const [activeUserId, setActiveUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // 实现搜索逻辑
  };

  const handleUserSelect = (userId) => {
    setActiveUserId(userId);
    // 加载用户消息
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'text',
      content,
      timestamp: new Date().getTime(),
      isCustomer: true
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendFile = (file) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'file',
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      timestamp: new Date().getTime(),
      isCustomer: true
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen">
      {/* 左侧用户列表 */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">消息</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {users.map(user => (
            <UserListItem
              key={user.id}
              user={user}
              isActive={user.id === activeUserId}
              onClick={handleUserSelect}
            />
          ))}
        </div>
      </div>

      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        {activeUserId ? (
          <>
            {/* 聊天头部 */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">
                {users.find(u => u.id === activeUserId)?.name}
              </h2>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCustomer={message.isCustomer}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onSendFile={handleSendFile}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            请选择一个聊天
          </div>
        )}
      </div>
    </div>
  );
}