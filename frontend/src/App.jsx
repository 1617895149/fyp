import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateProductPage from './pages/createProduct/CreateProductPage';
import List from './pages/productList/root'
import DetailRoot from './pages/detail/root';
import Cart from './pages/cart/root'
import Chat from './pages/chat/root'
//import ProductDetail from './pages/productDetail/ProductDetail'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/create" element={<CreateProductPage />} />
      <Route path="/products" element={<List />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/test" element={<Chat />} />
      <Route path="/product/:id" element={<DetailRoot />} />
      
      
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
