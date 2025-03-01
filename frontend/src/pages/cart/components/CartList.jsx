import { useState, useRef, useEffect } from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function CartList({ items, onUpdateQuantity, onRemoveItem }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [heights, setHeights] = useState({});
  const [quantities, setQuantities] = useState({});
  const contentRefs = useRef({});
  const [loadingItems, setLoadingItems] = useState({});

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

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    // 数量不能小于1
    if (newQuantity < 1) return;
    
    // 设置该商品为加载状态
    setLoadingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      // 调用父组件传入的更新函数
      await onUpdateQuantity(productId, newQuantity);
    } finally {
      // 无论成功失败，都取消加载状态
      setLoadingItems(prev => ({ ...prev, [productId]: false }));
    }
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
        {items.map((item) => (
          <li key={`${item.productId}-${item.optionalSpec}`} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row">
              {/* 商品图片 */}
              <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                <img
                  src={item.productImage[0] || 'https://via.placeholder.com/150'}
                  alt={item.productName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              {/* 商品信息 */}
              <div className="flex-1 sm:ml-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.productName}
                  </h3>
                  <p className="text-lg font-medium text-gray-900">
                    HK${(item.netPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
                
                <p className="mt-1 text-sm text-gray-500">
                  单价: HK${item.netPrice.toLocaleString()}
                </p>
                
                {item.optionalSpec && (
                  <p className="mt-1 text-sm text-gray-500">
                    规格: {
                      // 检查解析后的对象类型
                      (() => {
                        try {
                          const specs = JSON.parse(item.optionalSpec);
                          if (typeof specs === 'object' && !Array.isArray(specs)) {
                            // 如果是对象，显示键值对
                            return Object.entries(specs).map(([key, value]) => (
                              <div key={key} className="flex items-center mt-1">
                                <span className="font-medium">{key}:</span>
                                <span className="ml-2">{value}</span>
                              </div>
                            ));
                          } else if (Array.isArray(specs)) {
                            // 如果是数组，显示列表
                            return specs.map((spec, index) => (
                              <div key={index} className="mt-1">
                                <span>{spec}</span>
                              </div>
                            ));
                          } else {
                            // 其他情况
                            return <div className="mt-1">{String(specs)}</div>;
                          }
                        } catch (e) {
                          return <div className="mt-1">{item.optionalSpec}</div>;
                        }
                      })()
                    }
                  </p>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  {/* 数量控制 */}
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                      disabled={item.quantity <= 1 || loadingItems[item.productId]}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <FiMinus size={16} />
                    </button>
                    
                    <span className="px-4 py-2 text-gray-700 min-w-[40px] text-center">
                      {loadingItems[item.productId] ? (
                        <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
                      ) : (
                        item.quantity
                      )}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                      disabled={loadingItems[item.productId]}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
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
                    {(() => {
                      try {
                        const specs = JSON.parse(item.optionalSpec);
                        if (typeof specs === 'object' && !Array.isArray(specs)) {
                          // 如果是对象，显示键值对
                          return Object.entries(specs).map(([key, value]) => (
                            <div key={key} className="flex items-center mt-1">
                              <span className="font-medium">{key}:</span>
                              <span className="ml-2">{value}</span>
                            </div>
                          ));
                        } else if (Array.isArray(specs)) {
                          // 如果是数组，显示列表
                          return specs.map((spec, index) => (
                            <div key={index} className="mt-1">
                              <span>{spec}</span>
                            </div>
                          ));
                        } else {
                          // 其他情况
                          return <div className="mt-1">{String(specs)}</div>;
                        }
                      } catch (e) {
                        return <div className="mt-1">{item.optionalSpec}</div>;
                      }
                    })()}
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