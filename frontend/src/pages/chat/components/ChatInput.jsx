import { useState, useRef } from 'react';
import { FiSend, FiImage } from 'react-icons/fi';

const ChatInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const fileInputRef = useRef(null);
    const MAX_CHARS = 100;

    const handleInputChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setMessage(text);
            setCharCount(text.length);
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            setCharCount(0);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onSendMessage(reader.result, 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const isOverLimit = charCount === MAX_CHARS;

    return (
        <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    className={`flex-1 p-2 border rounded-lg ${
                        isOverLimit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="输入消息..."
                />
                <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                    {charCount}/{MAX_CHARS}
                </span>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-gray-500 hover:text-gray-700"
                >
                    <FiImage size={20} />
                </button>
                <button
                    onClick={handleSendMessage}
                    className="p-2 text-blue-500 hover:text-blue-700"
                >
                    <FiSend size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ChatInput; 