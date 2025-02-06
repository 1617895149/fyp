import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      
      <h2 className="mt-4 text-lg font-medium text-gray-900">
        购物车是空的
      </h2>
      
      <p className="mt-2 text-gray-600">
        快去选购你心仪的商品吧！
      </p>
      
      <Link
        to="/products"
        className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        继续购物
      </Link>
    </div>
  );
} 