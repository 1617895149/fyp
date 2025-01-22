import { useContext } from 'react';
import { ProductContext } from '../root';

export default function ProductInfo() {
  const [productState] = useContext(ProductContext);
  const { product } = productState;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>
      
      <p className="text-xl text-gray-900">
        HK${product.basePrice.toLocaleString()} 起
      </p>
      
      <div className="prose prose-sm text-gray-500">
        <p>{product.description}</p>
      </div>
      
      <div className="mt-10">
        <button
          type="submit"
          className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          加入购物车
        </button>
      </div>
    </div>
  );
} 