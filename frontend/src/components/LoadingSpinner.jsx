import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="flex flex-col items-center gap-4"
      >
        <i className="bi bi-arrow-clockwise text-4xl text-gray-600"></i>
        <span className="text-gray-600">加载中...</span>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 