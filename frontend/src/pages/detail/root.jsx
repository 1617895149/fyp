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
  const { id } = useParams(); // 获取URL中的商品ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [productState, setProductState] = useState({
    // 模拟后端数据
    product: {
      id: id, // 使用URL中的ID
      name: "iPhone 15 Pro",
      basePrice: 7999,
      description: "具有突破性的 A17 Pro 芯片、钛金属设计、Action 按钮等创新功能",
      images: [
        "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch_AV1",
        "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch_AV2"
      ],
      colors: ['自然钛金属', '蓝钛金属', '白钛金属', '黑钛金属'],
      storage: ['128GB', '256GB', '512GB', '1TB'],
      currentConfig: {
        color: '自然钛金属',
        storage: '128GB'
      }
    }
  });

  useEffect(() => {
    // 这里可以根据id从后端获取商品数据
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        // const response = await fetch(`/api/products/${id}`);
        // const data = await response.json();
        // setProductState(prev => ({ ...prev, product: data }));
        
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/404'); // 如果商品不存在，重定向到404页面
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

  return (
    <ProductContext.Provider value={[productState, setProductState]}>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-row">
            <div className='flex-grow-[8]'>
              <ProductGallery />
            </div>
            
            <div className="space-y-8 flex-grow-[2]">
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