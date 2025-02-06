export default function CartSummary({ items }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // 免运费
  const total = subtotal + shipping;

  return (
    <div className="sticky top-8 bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900">订单摘要</h2>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">小计</p>
          <p className="text-gray-900">HK${subtotal.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600">运费</p>
          <p className="text-green-600">免费</p>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-900">总计</p>
            <p className="text-lg font-medium text-gray-900">
              HK${total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        结算
      </button>
      
      <div className="mt-6 text-center">
        <a href="/products" className="text-blue-600 hover:text-blue-800">
          继续购物
        </a>
      </div>
    </div>
  );
} 