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
    const userId = 1; // Assuming userId is correctly retrieved from localStorage
    const connectionCheckerRef = useRef(null); // Ensure this is initialized
    

    

    // Check WebSocket connection status
    const checkConnection = () => {
        const isValid = stompClient.current?.connected || false;
        if (!isValid && !showModal) {
            setIsConnected(false);
            //setShowModal(true);
        }
        return isValid;
    };

    // Initialize WebSocket connection and check existing chat rooms
    useEffect(() => {
        const initialize = async () => {
            try {
                await checkExistingChatRoom();
                await connectWebSocket();
                connectionCheckerRef.current = setInterval(checkConnection, 3000);
            } catch (error) {
                console.error('Initialization failed:', error);
                setIsConnected(false);
                //setShowModal(true);
            }
        };

        initialize();

        return () => {
            clearInterval(connectionCheckerRef.current); // Cleanup interval
            stompClient.current?.deactivate(); // Deactivate WebSocket connection
        };
    }, [userId]);

    // Fetch existing chat rooms
    const checkExistingChatRoom = async () => {
        try {
            const response = await fetch('/api/chat/room', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Failed to fetch chat room data');
            }

            const data = await response.json();
            console.log('data', data[0]);
            if (data && data.length > 0) {
                setChatRoom(data[0]);
                console.log(data[0].messages);
                setMessages(data[0].messages);
                setShowModal(false);
            } else {
                console.log('No chat room found');
                setShowModal(true);
                setMessages([]);
            }
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error);
            setShowModal(true);
        }
    };

    // Create a new chat room
    const handleCreateChatRoom = async () => {
        setLoading(true);
        location.reload();
        try {
            await connectWebSocket();
            const response = await fetch('/api/chat/createRoom', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to create chat room');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Chat room creation failed:', error);
            setIsConnected(false);
            checkConnection();
        } finally {
            setLoading(false);
        }
    };

    // Manage WebSocket connection
    const connectWebSocket = () => {
        return new Promise((resolve, reject) => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }

            const client = new Client({
                brokerURL: 'ws://localhost:8080/ws',
                connectHeaders: {
                    userId,
                },
                onConnect: async () => {
                    try {
                        setIsConnected(true);
                        //setShowModal(false);

                        const response = await fetch('/api/chat/room', { credentials: 'include' });
                        if (response.ok) {
                            const chatRooms = await response.json();
                            if (chatRooms?.length > 0) {
                                const room = chatRooms[0];
                                setChatRoom(room);
                                subscribeToRoom(room.chatRoomId);
                            }
                        }
                    } catch (error) {
                        console.error('Failed to fetch chat room after connection:', error);
                        reject(error);
                    } finally {
                        resolve();
                    }
                },
                onDisconnect: () => {
                    console.log('WebSocket disconnected');
                    setIsConnected(false);
                    checkConnection();
                    reject(new Error('WebSocket disconnected'));
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket error:', error);
                    setIsConnected(false);
                    checkConnection();
                    reject(error);
                },
            });

            stompClient.current = client;
            client.activate();
        });
    };

    // Subscribe to room messages
    const subscribeToRoom = (roomId) => {
        if (stompClient.current) {
            console.log('Subscribing to room:', roomId);
            stompClient.current.subscribe(`/queue/messages/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                console.log('Received message:', newMessage);
                setShowModal(false);
                setLoading(false);
                setMessages((prev) => [...prev, newMessage]);
            });
        }
    };

    // Send messages via WebSocket
    const sendMessage = (content, type = 'text') => {
        if (!isConnected || !chatRoom) return;

        const message = {
            chatRoomId: chatRoom.chatRoomId,
            content,
            type,
        };

        stompClient.current.publish({
            destination: '/chat/send',
            body: JSON.stringify(message),
        });
        console.log('Sent message:', message);
        setLoading(true);
        setShowModal(true);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {chatRoom && isConnected && <ChatHeader chatRoom={chatRoom} />}
            <MessageList messages={messages} />
            <ChatInput onSendMessage={sendMessage} />
            {showModal && (
                <CreateChatModal onConfirm={handleCreateChatRoom} onCancel={() => navigate('/')} />
            )}
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default CustomerChat;