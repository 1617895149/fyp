import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
    }

    connect(userId, userRole) {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);

        return new Promise((resolve, reject) => {
            this.stompClient.connect({}, () => {
                const destination = userRole === 'ROLE_CUSTOMER' 
                    ? `/queue/customer.${userId}`
                    : `/queue/agent.${userId}`;
                    
                this.subscriptions.set(userId, 
                    this.stompClient.subscribe(destination, message => {
                        const chatMessage = JSON.parse(message.body);
                        // 处理收到的消息
                        this.messageHandler(chatMessage);
                    })
                );
                resolve();
            }, error => {
                reject(error);
            });
        });
    }

    sendMessage(message) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send("/app/chat.send", {}, JSON.stringify(message));
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
            this.subscriptions.clear();
            this.stompClient.disconnect();
        }
    }

    setMessageHandler(handler) {
        this.messageHandler = handler;
    }
}

export default new WebSocketService(); 