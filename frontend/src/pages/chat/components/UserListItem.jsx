import { formatTime } from '../utils/timeFormat';

export default function UserListItem({ user, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(user.id)}
      className={`flex items-center p-4 cursor-pointer transition-all duration-200
        ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
    >
      {/* 头像和未读消息提示 */}
      <div className="relative">
        <i className="bi bi-person-circle text-4xl text-gray-600"></i>
        {user.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                         flex items-center justify-center text-xs text-white">
            {user.unreadCount}
          </span>
        )}
      </div>

      {/* 用户信息 */}
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">{user.name}</span>
          <span className="text-xs text-gray-400">
            {formatTime(user.lastMessageTime)}
          </span>
        </div>
        
        <p className={`text-sm mt-1 ${
          user.unreadCount > 0 
            ? 'text-gray-900 font-medium' 
            : 'text-gray-500'
        }`}>
          {user.lastMessage}
        </p>
      </div>
    </div>
  );
} 