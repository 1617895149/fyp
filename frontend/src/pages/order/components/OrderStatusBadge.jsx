export default function OrderStatusBadge({ status }) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let label = '未知状态';
  
  switch (status) {
    case 'PENDING_PAYMENT':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = '待付款';
      break;
    case 'PAID':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = '已付款';
      break;
    case 'PROCESSING':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      label = '处理中';
      break;
    case 'SHIPPED':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      label = '已发货';
      break;
    case 'DELIVERED':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = '已送达';
      break;
    case 'COMPLETED':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = '已完成';
      break;
    case 'CANCELLED':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = '已取消';
      break;
    case 'REFUNDED':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = '已退款';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
} 