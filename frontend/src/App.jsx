import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductDetail from './pages/detail/root';
import Cart from './pages/cart/root';
import Orders from './pages/order/root';
import CustomerChat from './pages/chat/CustomerChat';
import CustomerServiceChat from './pages/chat/CustomerServiceChat';
import ProductList from './pages/productList/root';
import ProductCreate from './pages/createProduct/CreateProductPage';
import Dashboard from './pages/admin/dashboard';
import Test from './pages/admin/Orders';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/chat" element={<CustomerChat />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/create" element={<ProductCreate />} />
      <Route path="/cschat" element={<CustomerServiceChat />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;
