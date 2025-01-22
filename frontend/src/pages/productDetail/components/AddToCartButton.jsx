import { motion } from 'framer-motion';

const AddToCartButton = ({ onClick, loading }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center py-4 px-6 rounded-lg text-lg font-medium
        ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
        text-white transition-colors duration-200`}
    >
      {loading ? (
        <>
          <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
          添加中...
        </>
      ) : (
        <>
          <i className="bi bi-cart-plus mr-2"></i>
          添加到购物车
        </>
      )}
    </motion.button>
  );
};

export default AddToCartButton; 