import { formatTime } from '../utils/timeFormat';

export default function MessageBubble({ message, isCustomer }) {
  return (
    <div className={`flex flex-col mb-4 ${isCustomer ? 'items-end' : 'items-start'}`}>
      {/* 时间戳 */}
      <span className="text-xs text-gray-400 mb-1 items-start">
        {formatTime(message.timestamp)}
      </span>
      
      {/* 消息气泡 */}
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
        isCustomer 
          ? 'bg-[#333] text-white rounded-br-none ml-auto mr-4' 
          : 'bg-[#f7f7f7] text-gray-800 rounded-bl-none ml-4'
      } shadow-sm`}>
        {/* 文本消息 */}
        {message.type === 'text' && (
          <p className="break-words">{message.content}</p>
        )}
        
        {/* 文件消息 */}
        {message.type === 'file' && (
          <div className="flex items-center bg-gray-100 rounded p-2">
            <i className="bi bi-file-earmark mr-2"></i>
            <div>
              <p className="text-sm font-medium">{message.fileName}</p>
              <p className="text-xs text-gray-500">{message.fileSize}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 