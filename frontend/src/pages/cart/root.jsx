import { useState } from 'react';
import Navbar from '../detail/components/Navbar';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';

export default function Cart() {
  // 模拟后端数据
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "NVIDIA GeForce RTX 4090",
      price: 12999,
      quantity: 1,
      image: "https://cdn.cs.1worldsync.com/a1/2e/a12e3313-e909-4d60-8a5f-b15a34d0d5e3.jpg",
      specs: {
        memory: "24GB GDDR6X",
        boost_clock: "2.52 GHz",
        cuda_cores: "16384",
        power: "450W"
      }
    },
    {
      id: 2,
      name: "AMD Ryzen 9 7950X",
      price: 4999,
      quantity: 2,
      image: "https://example.com/ryzen9.jpg",
      specs: {
        cores: "16 cores/32 threads",
        base_clock: "4.5 GHz",
        boost_clock: "5.7 GHz",
        tdp: "170W"
      }
    },
    {
      id: 3,
      name: "AMD Ryzen 9 7950X",
      price: 4999,
      quantity: 2,
      image: "https://firebasestorage.googleapis.com/v0/b/fileserver-f7098.appspot.com/o/c1041827-0c72-49dc-9b09-c3dfc3d50568.jpg?alt=media",
      specs: {
        cores: "16 cores/32 threads",
        base_clock: "4.5 GHz",
        boost_clock: "5.7 GHz",
        tdp: "170W"
      }
    },
    {
      id: 4,
      name: "AMD Ryzen 9 7950X",
      price: 4999,
      quantity: 2,
      image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Swissbit_2GB_PC2-5300U-555.jpg",
      specs: {
        cores: "16 cores/32 threads",
        base_clock: "4.5 GHz",
        boost_clock: "5.7 GHz",
        tdp: "170W"
      }
    },
    {
      id: 5,
      name: "AMD Ryzen 9 7950X",
      price: 4999,
      quantity: 2,
      image: "https://cdn.cs.1worldsync.com/a1/2e/a12e3313-e909-4d60-8a5f-b15a34d0d5e3.jpg",
      specs: {
        cores: "16 cores/32 threads",
        base_clock: "4.5 GHz",
        boost_clock: "5.7 GHz",
        tdp: "170W"
      }
    },
    {
      id: 6,
      name: "AMD Ryzen 9 7950X",
      price: 4999,
      quantity: 2,
      image: "https://cdn.cs.1worldsync.com/a1/2e/a12e3313-e909-4d60-8a5f-b15a34d0d5e3.jpg",
      specs: {
        cores: "16 cores/32 threads",
        base_clock: "4.5 GHz",
        boost_clock: "5.7 GHz",
        tdp: "170W"
      }
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">购物车</h1>
        
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
              <CartSummary items={cartItems} />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </main>
    </div>
  );
}
