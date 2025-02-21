const ChatHeader = ({ chatRoom }) => {
    return (
        <div className="bg-white p-4 border-b shadow-sm">
            <h2 className="text-lg font-semibold">
                客服对话
            </h2>
            <p className="text-sm text-gray-500">
                聊天室ID: {chatRoom.chatRoomId}
            </p>
        </div>
    );
};

export default ChatHeader; 