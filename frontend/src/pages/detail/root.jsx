import { useState, createContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ConfigSelector from './components/ConfigSelector';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export const ProductContext = createContext();

export default function Root() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [productState, setProductState] = useState({
    product: null,
    currentConfig: {} // 用于存储用户选择的可选规格
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (data.code === 200) {
          setProductState({
            product: {
              ...data.data,
              specification: JSON.parse(data.data.specification),
              optionalSpec: JSON.parse(data.data.optionalSpec)
            },
            currentConfig: JSON.parse(data.data.optionalSpec) // 初始化选择配置
          });
        } else {
          throw new Error(data.message || '获取商品信息失败');
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/404');
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!productState.product) {
    return null;
  }

  return (
    <ProductContext.Provider value={[productState, setProductState]}>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-row">
            <div className='flex-grow-[6]'>
              <ProductGallery />
            </div>
            <div className="space-y-8 flex-grow-[4]">
              <ProductInfo />
              <ConfigSelector />
              <FAQ />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProductContext.Provider>
  );
}