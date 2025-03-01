import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
import OrderStatusBadge from './OrderStatusBadge';
import OrderItemDetails from './OrderItemDetails';

export default function OrderItem({ order, isSelected, isExpanded, onSelect, onToggleExpand }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li className={`${isExpanded ? 'bg-blue-50' : ''}`}>
      {/* 订单基本信息行 */}
      <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-3 font-medium">{order.id}</span>
        </div>
        <div className="text-gray-500">{formatDate(order.orderDate)}</div>
        <div>{order.customerName}</div>
        <div className="font-medium">HK${order.totalAmount.toLocaleString()}</div>
        <div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onToggleExpand}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? (
              <>
                <FiChevronUp className="mr-1" />
                收起
              </>
            ) : (
              <>
                <FiChevronDown className="mr-1" />
                展开
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* 订单详情部分 */}
      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">配送地址</h4>
              <p className="text-sm text-gray-900">{order.shippingAddress}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">联系方式</h4>
              <p className="text-sm text-gray-900">{order.contactPhone}</p>
              <p className="text-sm text-gray-900">{order.contactEmail}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">支付方式</h4>
            <p className="text-sm text-gray-900">{order.paymentMethod}</p>
          </div>
          
          {order.notes && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">备注</h4>
              <p className="text-sm text-gray-900">{order.notes}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">订单商品</h4>
            <div className="bg-white shadow rounded-md overflow-hidden">
              <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
                <div>商品</div>
                <div>单价</div>
                <div>数量</div>
                <div>小计</div>
                <div>操作</div>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <OrderItemDetails key={item.id} item={item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </li>
  );
} 