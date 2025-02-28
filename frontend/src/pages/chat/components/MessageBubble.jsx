import { format } from 'date-fns';

export default function MessageBubble({ message, isCustomer, isUnread }) {
    const bubbleClass = isCustomer
        ? "bg-blue-500 text-white self-end"
        : "bg-white text-gray-800 self-start";

    return (
        <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
            <div className={`
                max-w-[70%] p-3 rounded-lg
                ${isCustomer 
                    ? 'bg-white text-gray-800' 
                    : 'bg-blue-500 text-white'
                }
                ${isUnread ? 'ring-2 ring-yellow-400' : ''}
            `}>
                <p>{message.content}</p>
                <div className={`
                    text-xs mt-1
                    ${isCustomer ? 'text-gray-500' : 'text-blue-100'}
                `}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                    {isUnread && 
                        <span className="ml-2 text-yellow-500 font-medium">
                            未读消息
                        </span>
                    }
                </div>
            </div>
        </div>
    );
} 