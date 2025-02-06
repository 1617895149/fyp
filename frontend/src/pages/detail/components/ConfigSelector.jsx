import { useContext } from 'react';
import { ProductContext } from '../root';

export default function ConfigSelector() {
  const [productState, setProductState] = useContext(ProductContext);
  const { product, currentConfig } = productState;

  // 如果没有可选规格，不显示此组件
  if (Object.keys(product.optionalSpec).length === 0) {
    return null;
  }

  const handleConfigChange = (key, value) => {
    setProductState(prev => ({
      ...prev,
      currentConfig: {
        ...prev.currentConfig,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      {Object.entries(product.optionalSpec).map(([key, values]) => (
        <div key={key}>
          <h3 className="text-lg font-medium text-gray-900">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {values.map((value) => (
              <button
                key={value}
                onClick={() => handleConfigChange(key, value)}
                className={`relative flex items-center justify-center rounded-lg border p-4 focus:outline-none
                  ${currentConfig[key] === value 
                    ? 'border-blue-500 ring-2 ring-blue-500' 
                    : 'border-gray-300'}`}
              >
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 