import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'CPU', 'GPU', 'MOTHERBOARD', 'RAM'
];

// 不同类别的规格参数模板
const SPEC_TEMPLATES = {
  CPU: [
    { key: 'cores', label: '核心数', type: 'number' },
    { key: 'threads', label: '线程数', type: 'number' },
    { key: 'baseClock', label: '基础频率', type: 'text', placeholder: '例如: 3.6 GHz' },
    { key: 'boostClock', label: '加速频率', type: 'text', placeholder: '例如: 5.0 GHz' },
    { key: 'cache', label: '缓存', type: 'text', placeholder: '例如: 32MB L3' }
  ],
  GPU: [
    { key: 'memorySize', label: '显存容量', type: 'text', placeholder: '例如: 8GB' },
    { key: 'memoryType', label: '显存类型', type: 'text', placeholder: '例如: GDDR6' },
    { key: 'coreClock', label: '核心频率', type: 'text', placeholder: '例如: 1500 MHz' },
    { key: 'interface', label: '接口', type: 'text', placeholder: '例如: PCIe 4.0 x16' }
  ],
  RAM: [
    { key: 'capacity', label: '容量', type: 'text', placeholder: '例如: 16GB' },
    { key: 'speed', label: '频率', type: 'text', placeholder: '例如: DDR4-3200' },
    { key: 'timing', label: '时序', type: 'text', placeholder: '例如: CL16-18-18-38' }
  ],
};

const BasicInformation = ({ formData, setFormData }) => {
  const [specFields, setSpecFields] = useState([]);

  // 当类别改变时更新规格参数字段
  useEffect(() => {
    const templates = SPEC_TEMPLATES[formData.category] || [];
    setSpecFields(templates);
    
    // 重置规格参数值
    setFormData(prev => ({
      ...prev,
      specification: templates.reduce((acc, field) => {
        acc[field.key] = prev.specification?.[field.key] || '';
        return acc;
      }, {})
    }));
  }, [formData.category]);

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specification: {
        ...prev.specification,
        [key]: value
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <i className="bi bi-info-circle mr-2 text-blue-500"></i>
        基本信息
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品名称 *
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="请输入商品名称"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            品牌 *
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            placeholder="请输入品牌名称"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品类别 *
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            售价 (HKD) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            库存数量 *
          </label>
          <input
            type="number"
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            placeholder="请输入库存数量"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品描述 *
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="请输入商品描述"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            规格参数
            <span className="text-sm text-gray-500 ml-2">
              ({formData.category} 专属参数)
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specFields.map(field => (
              <div key={field.key}>
                <input
                  type={field.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.specification?.[field.key] || ''}
                  onChange={(e) => handleSpecChange(field.key, e.target.value)}
                  placeholder={field.placeholder || field.label}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BasicInformation; 