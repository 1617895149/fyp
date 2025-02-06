import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (data.code === 200) {
          setProduct(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>商品未找到</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <i className="bi bi-arrow-left mr-2"></i>
              返回
            </motion.button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* 商品图片 */}
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 商品信息 */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  HK$ {product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">库存: {product.stock} 件</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">{product.brand}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">商品描述</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* 规格信息 */}
            {product.specification && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">规格参数</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(JSON.parse(product.specification)).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">{key}</p>
                      <p className="text-base">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 可选规格 */}
            {product.optionalSpec && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">可选规格</h3>
                <div className="space-y-4">
                  {Object.entries(JSON.parse(product.optionalSpec)).map(([key, values]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-500 mb-2">{key}</p>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 