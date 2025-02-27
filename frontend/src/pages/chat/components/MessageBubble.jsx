import { format } from 'date-fns';

const MessageBubble = ({ message, isCustomer }) => {
    const bubbleClass = isCustomer
        ? "bg-blue-500 text-white self-end"
        : "bg-white text-gray-800 self-start";

    return (

        <div className={`m-2 p-4 border max-w-[15%] my-1 relative ${bubbleClass}  border-[#ddd] bg-[#f7f7f7] shadow-inset shadow-inset-[inset_0_32px_32px_-32px_rgba(0,0,0,0.05)_inset_0_-32px_32px_-32px_rgba(0,0,0,0.05)] rounded-[20px_20px_20px_0px] text-left`}>
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