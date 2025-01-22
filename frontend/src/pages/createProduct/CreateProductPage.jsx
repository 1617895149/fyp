import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BasicInformation from './components/BasicInformation';
import ImageUpload from './components/ImageUpload';
import OptionalSpecification from './components/OptionalSpecification';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: 'CPU',
    description: '',
    specification: {},
    optionalSpec: {}
  });
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('data', new Blob([JSON.stringify({
        ...formData,
        optionalSpec: specifications.reduce((acc, spec) => {
          acc[spec.name] = spec.values;
          return acc;
        }, {})
      })], { type: 'application/json' }));

      images.forEach(image => {
        formDataToSend.append('image', image.file);
      });

      console.log(formDataToSend.forEach((element) => console.log(element)))


      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      if (data.code === 201) {
        navigate(`/products/${data.data}`);
      } else {
        throw new Error(data.message);
      }

      
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      brand: '',
      price: '',
      stock: '',
      category: 'CPU',
      description: '',
      specification: {},
      optionalSpec: {}
    });
    
    images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    setImages([]);
    
    setSpecifications([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">创建新商品</h1>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <i className="bi bi-arrow-counterclockwise mr-2"></i>
                重置表单
              </motion.button>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformation formData={formData} setFormData={setFormData} />
          <ImageUpload images={images} setImages={setImages} />
          <OptionalSpecification 
            specifications={specifications} 
            setSpecifications={setSpecifications} 
          />

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleReset}
              className="flex items-center px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <i className="bi bi-arrow-counterclockwise mr-2"></i>
              重置
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`flex items-center px-6 py-3 rounded-lg text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
                  创建中...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle mr-2"></i>
                  创建商品
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage; 