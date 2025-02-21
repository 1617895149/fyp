import { format } from 'date-fns';

const MessageBubble = ({ message, isCustomer }) => {
    const bubbleClass = isCustomer
        ? "bg-blue-500 text-white self-end"
        : "bg-white text-gray-800 self-start";

    return (
        <div className={`max-w-[70%] rounded-lg p-3 my-1 relative ${bubbleClass}`}>
            <p className="break-words">{message.content}</p>
            {message.type === 'image' && (
                <img 
                    src={message.content} 
                    alt="发送的图片" 
                    className="max-w-full rounded-lg mt-2"
                />
            )}
            <span className="text-xs opacity-70 absolute bottom-1 right-2">
                {format(new Date(message.timestamp), 'HH:mm')}
            </span>
        </div>
    );
};

export default MessageBubble; 