import { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose, onSubmit, totalAmount }) {
  const [formData, setFormData] = useState({
    shippingAddress: '',
    contactPhone: '',
    contactEmail: '',
    paymentMethod: 'CREDIT_CARD', // 默认支付方式
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = '请输入配送地址';
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = '请输入联系电话';
    } else if (!/^\d{8,11}$/.test(formData.contactPhone.trim())) {
      newErrors.contactPhone = '请输入有效的电话号码';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = '请输入联系邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail.trim())) {
      newErrors.contactEmail = '请输入有效的邮箱地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('提交订单失败:', error);
      setErrors({ submit: '提交订单失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">完成订单</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">配送地址</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.shippingAddress ? 'border-red-500' : 'border-gray-300'}`}
              rows="3"
            />
            {errors.shippingAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">联系电话</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">联系邮箱</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">支付方式</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="CREDIT_CARD">信用卡</option>
              <option value="ALIPAY">支付宝</option>
              <option value="WECHAT_PAY">微信支付</option>
              <option value="BANK_TRANSFER">银行转账</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">备注</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="2"
            />
          </div>
          
          <div className="mb-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">总金额:</span>
              <span className="font-semibold text-lg">HK${totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '确认订单'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 