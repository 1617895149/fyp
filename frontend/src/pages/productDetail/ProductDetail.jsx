import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductHeader from './components/ProductHeader';
//import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import AddToCartButton from './components/AddToCartButton';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (data.code === 200) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      // 添加到购物车的逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>商品未找到</div>;

  return (
    <div className="min-h-screen bg-white">
      <ProductHeader name={product.name} price={product.price} />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={[product.imageUrl]} />
          
          <div className="space-y-8">
            <ProductInfo 
              description={product.description}
              specifications={JSON.parse(product.specification || '{}')}
            />
            
            <AddToCartButton 
              onClick={handleAddToCart}
              loading={addingToCart}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail; 