import { motion, AnimatePresence } from 'framer-motion';

const OptionalSpecification = ({ specifications, setSpecifications }) => {
  const addSpecification = () => {
    setSpecifications([...specifications, { name: '', values: [''] }]);
  };

  const removeSpecification = (index) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const addValue = (specIndex) => {
    const newSpecs = [...specifications];
    newSpecs[specIndex].values.push('');
    setSpecifications(newSpecs);
  };

  const removeValue = (specIndex, valueIndex) => {
    const newSpecs = [...specifications];
    newSpecs[specIndex].values.splice(valueIndex, 1);
    setSpecifications(newSpecs);
  };

  const updateSpecName = (index, name) => {
    const newSpecs = [...specifications];
    newSpecs[index].name = name;
    setSpecifications(newSpecs);
  };

  const updateSpecValue = (specIndex, valueIndex, value) => {
    const newSpecs = [...specifications];
    newSpecs[specIndex].values[valueIndex] = value;
    setSpecifications(newSpecs);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="bi bi-gear mr-2 text-blue-500"></i>
          可选规格
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addSpecification}
          type="button"
          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <i className="bi bi-plus-lg mr-1"></i>
          添加规格
        </motion.button>
      </div>

      <AnimatePresence>
        {specifications.map((spec, specIndex) => (
          <motion.div
            key={specIndex}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <input
                type="text"
                placeholder="规格名称"
                value={spec.name}
                onChange={(e) => updateSpecName(specIndex, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeSpecification(specIndex)}
                className="text-red-500 hover:text-red-600"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>

            <div className="space-y-2">
              {spec.values.map((value, valueIndex) => (
                <motion.div
                  key={valueIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="规格值"
                    value={value}
                    onChange={(e) => updateSpecValue(specIndex, valueIndex, e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeValue(specIndex, valueIndex)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => addValue(specIndex)}
              className="mt-2 flex items-center px-3 py-1 text-sm text-blue-500 hover:text-blue-600"
            >
              <i className="bi bi-plus-lg mr-1"></i>
              添加规格值
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default OptionalSpecification; 