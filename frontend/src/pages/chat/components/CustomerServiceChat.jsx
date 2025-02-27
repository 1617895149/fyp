import React, { useState } from 'react'
import Contact from './Contact'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'
import { FiSearch, FiMessageSquare } from 'react-icons/fi'
import Client from 'stompjs'

export default function CustomerServiceChat() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [agentId, setAgentId] = useState('123'); // Assuming a default agentId

  const handleSelectCustomer = async (customerId) => {
    // 断开现有连接
    if (stompClient.current) {
        await stompClient.current.deactivate();
    }
    
    setSelectedCustomer(customerId);
    
    // 建立新连接
    const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        connectHeaders: {
            userId: agentId,
            chatRoomId: `${customerId}:${agentId}` // 使用聊天室ID格式
        },
        // ... 其他配置
    });
    
    setStompClient(client);
    await client.activate();
  };

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
          <Contact 
            customerId="123"
            active={selectedCustomer === "123"}
            lastMessage="最新消息内容" 
            time="12:30" 
            unread={3}
            onSelect={handleSelectCustomer}
          />
          <Contact 
            customerId="124"
            active={selectedCustomer === "124"}
            lastMessage="之前的消息" 
            time="11:45"
            onSelect={handleSelectCustomer}
          />
          <Contact 
            customerId="125"
            active={selectedCustomer === "125"}
            lastMessage="更早的消息" 
            time="昨天"
            onSelect={handleSelectCustomer}
          />
          {/* 添加更多联系人 */}
        </div>
      </div>

      {/* 右侧聊天区域 */}
      <div className='flex-1 flex flex-col bg-gray-50'>
        {selectedCustomer ? (
          <>
            <div className='bg-white p-4 border-b border-gray-200 sticky top-0 z-10'>
              <h2 className="text-lg font-semibold">客户 #{selectedCustomer}</h2>
              <p className="text-sm text-gray-500">在线 - 最后活跃时间: 2分钟前</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <MessageBubble
                message={{
                  content: "您好，请问有什么可以帮助您的？",
                  timestamp: new Date(),
                  senderRole: "ROLE_CUSTOMER_SERVICE"
                }}
                isCustomer={false}
              />
              <MessageBubble
                message={{
                  content: "我想询问一下产品的价格",
                  timestamp: new Date(),
                  senderRole: "ROLE_CUSTOMER"
                }}
                isCustomer={true}
              />
              {/* 添加更多消息 */}
            </div>

            <div className="border-t border-gray-200 bg-white">
              <ChatInput onSendMessage={(message) => console.log('发送消息:', message)} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FiMessageSquare size={64} className="mb-4" />
            <p className="text-lg">选择一个客户开始聊天</p>
            <p className="text-sm mt-2">从左侧列表选择一个客户进行对话</p>
          </div>
        )}
      </div>
    </div>
  )
}
