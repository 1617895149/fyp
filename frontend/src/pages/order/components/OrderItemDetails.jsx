import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function OrderItemDetails({ item }) {
  const [showSpecs, setShowSpecs] = useState(false);
  
  // 解析商品规格
  const parseSpecification = (specString) => {
    try {
      return JSON.parse(specString);
    } catch (e) {
      return specString;
    }
  };
  
  const specs = item.productSpecification ? parseSpecification(item.productSpecification) : null;
  
  return (
    <li className="px-4 py-3">
      <div className="grid grid-cols-5 gap-4 items-center">
        <div className="flex items-center">
          <img
            src={item.productImage || 'https://via.placeholder.com/50'}
            alt={item.productName}
            className="w-12 h-12 object-cover rounded-md mr-3"
          />
          <div>
            <h5 className="text-sm font-medium text-gray-900">{item.productName}</h5>
            {specs && (
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                {showSpecs ? '收起规格' : '查看规格'}
                {showSpecs ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
              </button>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">HK${item.unitPrice.toLocaleString()}</div>
        <div className="text-sm text-gray-500">x{item.quantity}</div>
        <div className="text-sm font-medium text-gray-900">HK${item.subtotal.toLocaleString()}</div>
        <div>
          <button className="text-xs text-blue-600 hover:text-blue-800">
            再次购买
          </button>
        </div>
      </div>
      
      {/* 商品规格详情 */}
      {showSpecs && (
        <div className="mt-3 ml-16 p-3 bg-gray-50 rounded-md text-xs">
          <h6 className="font-medium text-gray-700 mb-2">商品规格</h6>
          {typeof specs === 'object' && !Array.isArray(specs) ? (
            <ul className="space-y-1">
              {Object.entries(specs).map(([key, value]) => (
                <li key={key} className="flex">
                  <span className="font-medium text-gray-600 mr-2">{key}:</span>
                  <span className="text-gray-800">{value}</span>
                </li>
              ))}
            </ul>
          ) : Array.isArray(specs) ? (
            <ul className="space-y-1">
              {specs.map((spec, index) => (
                <li key={index} className="text-gray-800">{spec}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-800">{specs}</p>
          )}
        </div>
      )}
    </li>
  );
} 