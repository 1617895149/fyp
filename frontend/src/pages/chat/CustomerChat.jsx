import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import CreateChatModal from './components/CreateChatModal';
import LoadingSpinner from './components/LoadingSpinner';

const CustomerChat = () => {
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const stompClient = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const connectionCheckerRef = useRef(null);

    // 检查WebSocket连接状态
    const checkConnection = () => {
        const isValid = stompClient.current?.connected || false;
        console.log('WebSocket连接状态:', isValid ? '有效' : '无效');
        
        if (!isValid && !showModal) {
            setIsConnected(false);
            setShowModal(true);
        }
        return isValid;
    };

    useEffect(() => {
        // 初始检查连接
        checkConnection();

        // 设置定期检查
        connectionCheckerRef.current = setInterval(checkConnection, 3000);

        return () => {
            // 清理定时器和WebSocket连接
            if (connectionCheckerRef.current) {
                clearInterval(connectionCheckerRef.current);
            }
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    const checkExistingChatRoom = async () => {
        try {
            const response = await fetch('/api/chat/room', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setChatRoom(data[0]);
                    if (!isConnected) {
                        setShowModal(true);
                    }
                } else {
                    setShowModal(true);
                }
            } else {
                setShowModal(true);
            }
        } catch (error) {
            console.error('检查聊天室失败:', error);
            setShowModal(true);
        }
    };

    const handleCreateChatRoom = async () => {
        setLoading(true);
        try {
            await connectWebSocket();
            
            const response = await fetch('/api/chat/createRoom', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('创建聊天室失败');
            }
            
            setShowModal(false);
        } catch (error) {
            console.error('创建聊天室失败:', error);
            setIsConnected(false);
            checkConnection();
        }
        setLoading(false);
    };

    const connectWebSocket = () => {
        return new Promise((resolve, reject) => {
            try {
                if (stompClient.current) {
                    stompClient.current.deactivate();
                }

                const client = new Client({
                    brokerURL: 'ws://localhost:8080/ws',
                    connectHeaders: {},
                    onConnect: () => {
                        console.log('WebSocket连接已建立');
                        setIsConnected(true);
                        setShowModal(false);
                        subscribeToUserId();
                        resolve();
                    },
                    onDisconnect: () => {
                        console.log('WebSocket连接已断开');
                        setIsConnected(false);
                        checkConnection();
                        reject(new Error('WebSocket disconnected'));
                    },
                    onWebSocketError: (error) => {
                        console.log('WebSocket连接错误:', error);
                        setIsConnected(false);
                        checkConnection();
                        reject(error);
                    }
                });

                stompClient.current = client;
                client.activate();
            } catch (error) {
                reject(error);
            }
        });
    };

    const subscribeToUserId = () => {
        if (stompClient.current && userId) {
            stompClient.current.subscribe(`/queue/chatroom/${userId}`, (response) => {
                const chatRoom = JSON.parse(response.body);
                setChatRoom(chatRoom);
                switchToChatRoomChannel(chatRoom.chatRoomId);
            });
        }
    };

    const switchToChatRoomChannel = (roomId) => {
        if (stompClient.current) {
            stompClient.current.subscribe(`/queue/messages/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages(prev => [...prev, newMessage]);
            });
        }
    };

    const sendMessage = async (content, type = 'text') => {
        if (!isConnected || !chatRoom) return;

        const message = {
            chatRoomId: chatRoom.chatRoomId,
            content,
            type
        };

        stompClient.current.publish({
            destination: '/chat/send',
            body: JSON.stringify(message)
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {chatRoom && isConnected && <ChatHeader chatRoom={chatRoom} />}
            {isConnected && <MessageList messages={messages} />}
            {isConnected && <ChatInput onSendMessage={sendMessage} />}
            {showModal && (
                <CreateChatModal 
                    onConfirm={handleCreateChatRoom}
                    onCancel={() => navigate('/')}
                />
            )}
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default CustomerChat; 