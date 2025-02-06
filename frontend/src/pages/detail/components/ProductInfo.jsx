import { useContext, useState } from 'react';
import { ProductContext } from '../root';
import { useNavigate } from 'react-router-dom';

export default function ProductInfo() {
  const [productState] = useContext(ProductContext);
  const { product, currentConfig } = productState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          productId: window.location.href.substring(window.location.href.lastIndexOf("/")).replace("/", ""),
          price: product.price,
          quantity: 1,
          optionalSpec: JSON.stringify(currentConfig)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login', { 
            state: { from: `/product/${product.id}` } 
          });
          return;
        }
        throw new Error(data.message || '添加到购物车失败');
      }

      alert('成功添加到购物车！');
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-[100%] min-w[100%]">
      <div className="flex items-center space-x-2">
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
          {product.category}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
          {product.brand}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>

      <p className="text-xl text-gray-900">
        HK${product.price.toLocaleString()}
      </p>

      <div className="prose prose-sm text-gray-500">
        <p>{product.description}</p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">基本规格</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(product.specification).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm text-gray-500">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-base text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className={`w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 
                     flex items-center justify-center text-base font-medium text-white 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed
                     transition-colors duration-200`}
        >
          {loading ? '添加中...' : '加入购物车'}
        </button>
      </div>
    </div>
  );
} 