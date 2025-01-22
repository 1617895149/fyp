import { motion } from 'framer-motion';

const ProductInfo = ({ description, specifications }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="prose prose-lg">
        <p>{description}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">规格</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">{key}</p>
              <p className="text-base">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductInfo; 