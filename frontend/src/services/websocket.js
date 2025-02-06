import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        this.messageHandler = null;
    }

    connect(userId, userRole) {
        return new Promise((resolve, reject) => {
            try {
                this.stompClient = new Client({
                    brokerURL: 'ws://localhost:8080/ws',
                    debug: function (str) {
                        console.log('STOMP: ' + str);
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                });

                this.stompClient.onConnect = () => {
                    console.log('Connected to STOMP');
                    const destination = userRole === 'ROLE_CUSTOMER' 
                        ? `/queue/customer.${userId}`
                        : `/queue/agent.${userId}`;
                        
                    try {
                        this.subscriptions.set(userId, 
                            this.stompClient.subscribe(destination, message => {
                                if (this.messageHandler) {
                                    const chatMessage = JSON.parse(message.body);
                                    this.messageHandler(chatMessage);
                                }
                            })
                        );
                        resolve();
                    } catch (error) {
                        console.error('Subscription error:', error);
                        reject(error);
                    }
                };

                this.stompClient.onStompError = (frame) => {
                    console.error('STOMP error:', frame);
                    reject(new Error('STOMP protocol error'));
                };

                this.stompClient.onWebSocketError = (event) => {
                    console.error('WebSocket error:', event);
                    reject(new Error('WebSocket error'));
                };

                this.stompClient.activate();
            } catch (error) {
                console.error('Connection setup error:', error);
                reject(error);
            }
        });
    }

    sendMessage(message) {
        if (this.stompClient?.active) {
            try {
                this.stompClient.publish({
                    destination: '/app/chat.send',
                    body: JSON.stringify(message)
                });
            } catch (error) {
                console.error('Send message error:', error);
            }
        } else {
            console.warn('STOMP client is not active');
        }
    }

    disconnect() {
        try {
            if (this.stompClient?.active) {
                this.subscriptions.forEach(subscription => {
                    try {
                        subscription.unsubscribe();
                    } catch (error) {
                        console.error('Unsubscribe error:', error);
                    }
                });
                this.subscriptions.clear();
                this.stompClient.deactivate();
            }
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    }

    setMessageHandler(handler) {
        this.messageHandler = handler;
    }
}

export default new WebSocketService(); 