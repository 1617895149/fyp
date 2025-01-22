import { useContext } from 'react';
import { ProductContext } from '../root';

export default function ConfigSelector() {
  const [productState, setProductState] = useContext(ProductContext);
  const { product } = productState;

  const handleColorChange = (color) => {
    setProductState(prev => ({
      ...prev,
      product: {
        ...prev.product,
        currentConfig: {
          ...prev.product.currentConfig,
          color
        }
      }
    }));
  };

  const handleStorageChange = (storage) => {
    setProductState(prev => ({
      ...prev,
      product: {
        ...prev.product,
        currentConfig: {
          ...prev.product.currentConfig,
          storage
        }
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* 颜色选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">选择颜色</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`relative flex items-center justify-center rounded-lg border p-4 focus:outline-none
                ${product.currentConfig.color === color 
                  ? 'border-blue-500 ring-2 ring-blue-500' 
                  : 'border-gray-300'}`}
            >
              <span className="flex items-center">
                <span className="flex-shrink-0 inline-block w-2 h-2 rounded-full mr-2"
                      style={{ 
                        backgroundColor: 
                          color === '自然钛金属' ? '#B4B4B6' :
                          color === '蓝钛金属' ? '#394C5C' :
                          color === '白钛金属' ? '#F5F5F7' :
                          '#1D1D1F' // 黑钛金属
                      }}
                />
                <span className="text-sm font-medium text-gray-900">{color}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 存储容量选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">选择存储容量</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {product.storage.map((storage) => (
            <button
              key={storage}
              onClick={() => handleStorageChange(storage)}
              className={`relative flex items-center justify-between rounded-lg border p-4 focus:outline-none
                ${product.currentConfig.storage === storage 
                  ? 'border-blue-500 ring-2 ring-blue-500' 
                  : 'border-gray-300'}`}
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{storage}</span>
                <span className="text-sm text-gray-500">
                  {storage === '128GB' ? '建议容量' : 
                   storage === '256GB' ? '推荐容量' : 
                   storage === '512GB' ? '充足容量' : 
                   '专业容量'}
                </span>
              </span>
              <span className="text-sm font-medium text-gray-900">
                HK${(parseInt(storage) === 128 ? product.basePrice : 
                     parseInt(storage) === 256 ? product.basePrice + 1000 :
                     parseInt(storage) === 512 ? product.basePrice + 2000 :
                     product.basePrice + 3000).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 