import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateProductPage from './pages/createProduct/CreateProductPage';
import List from './pages/productList/root'
import DetailRoot from './pages/detail/root';
import Cart from './pages/cart/root'
import { UserRole } from './types/enums';
import CustomerChat from './pages/chat/CustomerChat';
import Test from './pages/chat/CustomerServiceChat';

const App = () => {
  // 这里可以从认证状态获取用户信息
  const currentUser = {
    id: localStorage.getItem('userId') || 'user123', // 从localStorage获取用户ID
    role: localStorage.getItem('userRole') || UserRole.CUSTOMER, // 从localStorage获取用户角色
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/create" element={<CreateProductPage />} />
      <Route path="/products" element={<List />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/chat" element={<CustomerChat />} />
      <Route path="/test" element={<Test />} />
      <Route path="/product/:id" element={<DetailRoot />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
