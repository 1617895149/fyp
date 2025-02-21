import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import Bar from './bar';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // 添加错误状态
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 添加登录状态

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // 清空之前的错误信息
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.code === 200) {
        setIsAuthenticated(true); // 设置登录状态为 true
      } else {
        throw new Error(data.message); // 抛出错误以触发 catch
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message); // 设置错误信息
    } finally {
      setLoading(false);
    }
  };

  // 如果用户已登录，直接跳转到 /products 页面
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 w-[100%]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            或{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              创建新账户
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Bar 
              placeholder="用户名"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <Bar 
              placeholder="密码"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          {error && (
            <p className="text-red-500 text-center">{error}</p> // 显示错误信息
          )}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? (
              <div className="flex items-center">
                <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
                登录中...
              </div>
            ) : (
              <div className="flex items-center">
                登录
                <i className="bi bi-arrow-right-circle-fill ml-2"></i>
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;