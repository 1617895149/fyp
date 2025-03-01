export default function OrderFilter({ statusFilter, onStatusChange }) {
  const statuses = [
    { value: 'ALL', label: '全部' },
    { value: 'PENDING_PAYMENT', label: '待付款' },
    { value: 'PAID', label: '已付款' },
    { value: 'PROCESSING', label: '处理中' },
    { value: 'SHIPPED', label: '已发货' },
    { value: 'DELIVERED', label: '已送达' },
    { value: 'COMPLETED', label: '已完成' },
    { value: 'CANCELLED', label: '已取消' },
    { value: 'REFUNDED', label: '已退款' }
  ];
  
  return (
    <div className="mb-6 p-4 bg-white shadow rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-3">订单状态</h3>
      <div className="flex flex-wrap gap-2">
        {statuses.map(status => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`px-3 py-1 rounded-full text-sm ${
              statusFilter === status.value
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
} 