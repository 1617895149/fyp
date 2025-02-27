import { useState, useContext } from 'react';
import { ProductContext } from '../root';

export default function ProductGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productState] = useContext(ProductContext);
  const { product } = productState;

 
  const images = product.imageUrl;
  console.log(1111);
  console.log(images);

  const handleSlide = (direction) => {
    if (direction === 'next') {
      setCurrentIndex(prev => (prev + 1) % images.length);
    } else {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="sticky top-24 space-y-4 w-full pr-12">
      {/* 主图容器 */}
      <div className="relative rounded-lg bg-white">
        {/* 图片容器 */}
        <div className="flex justify-center items-center h-[400px]"> {/* 固定高度容器 */}
          <img
            src={images[currentIndex].toString()}
            alt={product.name}
            className="max-w-full max-h-full object-contain" // 图片自适应
          />
        </div>

        {/* 前进/后退按钮 */}
        <button
          onClick={() => handleSlide('prev')}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 
                     flex items-center justify-center hover:bg-white transition-colors duration-200
                     focus:outline-none group"
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
          disabled={currentIndex === 0}
        >
          <svg 
            className="w-6 h-6 text-gray-800 group-hover:text-gray-900" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => handleSlide('next')}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 
                     flex items-center justify-center hover:bg-white transition-colors duration-200
                     focus:outline-none group"
          style={{ opacity: currentIndex === images.length - 1 ? 0.5 : 1 }}
          disabled={currentIndex === images.length - 1}
        >
          <svg 
            className="w-6 h-6 text-gray-800 group-hover:text-gray-900" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200
                ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-400'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 缩略图 */}
      <div className="flex space-x-4 mt-4 justify-center">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative rounded-md overflow-hidden w-24 h-24 focus:outline-none
                      transition-all duration-200 hover:ring-2 hover:ring-gray-400
                      ${currentIndex === index ? 'ring-2 ring-blue-500' : ''}`}
          >
            <img
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}