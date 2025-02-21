import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => (
                <MessageBubble
                    key={index}
                    message={message}
                    isCustomer={message.senderRole === 'ROLE_CUSTOMER'}
                />
            ))}
        </div>
    );
};

export default MessageList; 