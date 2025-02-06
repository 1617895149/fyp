import { motion } from 'framer-motion';

const ProductHeader = ({ name, price }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="sticky top-0 z-10 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        <p className="text-xl text-gray-600">
          HK$ {price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductHeader; 