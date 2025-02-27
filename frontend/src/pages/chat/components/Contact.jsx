import React from 'react'

export default function Contact({ customerId, active, lastMessage, time, unread, onSelect }) {
    return (
        <div 
            onClick={() => onSelect(customerId)}
            className={`group flex items-center p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200
                ${active ? 'bg-blue-100' : ''}`}
        >
            <div className="relative">
                <i className={`bi bi-person-circle text-4xl transition-colors duration-200
                    ${active ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-500'}`}></i>
                {unread && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                        rounded-full w-5 h-5 flex items-center justify-center">
                        {unread}
                    </span>
                )}
            </div>
            
            <div className='ml-3 flex-1 min-w-0'>
                <div className='flex justify-between items-center'>
                    <h3 className={`text-sm font-medium truncate transition-colors duration-200
                        ${active ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-500'}`}>
                        客户 #{customerId}
                    </h3>
                    <span className='text-xs text-gray-500'>{time}</span>
                </div>
                <p className={`text-sm truncate transition-colors duration-200
                    ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-400'}`}>
                    {lastMessage}
                </p>
            </div>
        </div>
    )
}
