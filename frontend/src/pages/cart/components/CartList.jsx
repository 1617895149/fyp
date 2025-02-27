import { useState, useRef, useEffect } from 'react';

export default function CartList({ items, onUpdateQuantity, onRemoveItem }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [heights, setHeights] = useState({});
  const [quantities, setQuantities] = useState({});
  const contentRefs = useRef({});

  useEffect(() => {
    // 初始化数量状态
    const initialQuantities = {};
    items.forEach(item => {
      initialQuantities[item.productId] = item.quantity;
    });
    setQuantities(initialQuantities);

    // 设置展开高度
    items.forEach(item => {
      if (contentRefs.current[item.productId]) {
        const height = contentRefs.current[item.productId].scrollHeight;
        setHeights(prev => ({
          ...prev,
          [item.productId]: height
        }));
      }
    });
  }, [items]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // 防止数量小于1
    
    // 立即更新本地状态，提供即时反馈
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));

    // 调用父组件的更新方法
    await onUpdateQuantity(productId, newQuantity);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {items.map(item => (
          <li key={item.productId} className="p-6">
            <div className="flex items-center">
              <img 
                src={item.productImage[0]} 
                alt={item.productName}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                  <p className="text-lg font-medium text-gray-900">
                    HK${(item.netPrice * quantities[item.productId]).toLocaleString()}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.productId, quantities[item.productId] - 1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      disabled={quantities[item.productId] <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x min-w-[40px] text-center">
                      {quantities[item.productId]}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, quantities[item.productId] + 1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    移除
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => toggleExpand(item.productId)}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                {expandedItems.has(item.productId) ? '收起' : '查看'} 详细规格
                <svg
                  className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                    expandedItems.has(item.productId) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div className="overflow-hidden transition-[height] duration-500 ease-in-out"
                   style={{ height: expandedItems.has(item.productId) ? `${heights[item.productId]}px` : '0' }}>
                <div ref={el => contentRefs.current[item.productId] = el}>
                  <div className="py-2">
                    {Object.entries(JSON.parse(item.optionalSpec)).map(([key, value]) => (
                      <div key={key} className="flex items-center mt-1">
                        <span className="font-medium">{key}:</span>
                        <span className="ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 