import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ images, setImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
    if (currentIndex >= newImages.length) {
      setCurrentIndex(Math.max(0, newImages.length - 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <i className="bi bi-images mr-2 text-blue-500"></i>
        商品图片
      </h3>

      <div className="max-w-full h-[500px] relative">
        {/* 主图片显示区域 - 70% 高度 */}
        <div className="w-full h-[70%] flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex].preview}
                  alt="Preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                  >
                    <i className="bi bi-chevron-left text-2xl"></i>
                  </button>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                  >
                    <i className="bi bi-chevron-right text-2xl"></i>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center">
              <i className="bi bi-cloud-upload text-4xl text-gray-400"></i>
              <p className="mt-2 text-sm text-gray-500">点击或拖拽图片上传</p>
            </div>
          )}
        </div>

        {/* 缩略图预览区域 - 30% 高度 */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gray-50 rounded-lg p-4">
          <div className="flex gap-4 overflow-x-auto h-full items-center">
            {images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`relative flex-shrink-0 ${
                  currentIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-lg cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  <i className="bi bi-x"></i>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 文件上传输入框 */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-[70%] opacity-0 cursor-pointer"
        />
      </div>
    </motion.div>
  );
};

export default ImageUpload; 