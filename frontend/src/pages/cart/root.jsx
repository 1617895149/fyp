import { useState, useEffect } from 'react';
import Navbar from '../detail/components/Navbar';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import CheckoutModal from './components/CheckoutModal';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchCartItems = () => {
    fetch('http://localhost:8080/api/cart', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        setCartItems(data.data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/product/${productId}/quantity`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      console.log(JSON.stringify({ quantity: newQuantity }));

      if (response.ok) {
        setCartItems(items =>
          items.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/product/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCartItems(items => items.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = (total) => {
    setCheckoutTotal(total);
    setIsCheckoutModalOpen(true);
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.code === 200) {
        // 订单创建成功
        setOrderSuccess(true);
        // 清空购物车（后端已经处理，这里只更新前端状态）
        setCartItems([]);
        
        // 显示成功消息
        alert('订单创建成功！');
        
        // 可以选择跳转到订单详情页
        // window.location.href = `/orders/${result.data.id}`;
      } else {
        throw new Error(result.message || '创建订单失败');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('创建订单失败: ' + error.message);
      throw error;
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">购物车</h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800"
            >
              清空购物车
            </button>
          )}
        </div>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartList 
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            </div>
            <div className="lg:col-span-1">
              <CartSummary 
                items={cartItems} 
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </main>

      {/* 结算弹窗 */}
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmit={handleSubmitOrder}
        totalAmount={checkoutTotal}
      />
    </div>
  );
}
