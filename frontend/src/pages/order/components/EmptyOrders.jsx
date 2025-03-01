import { FiShoppingBag } from 'react-icons/fi';

export default function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white shadow rounded-lg">
      <FiShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
      <p className="text-gray-500 mb-6">您还没有任何订单，快去选购商品吧！</p>
      <a
        href="/products"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        浏览商品
      </a>
    </div>
  );
} 