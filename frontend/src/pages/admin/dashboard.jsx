import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiUsers, FiShoppingBag, FiTruck, FiDollarSign, FiMenu, FiSettings, FiBarChart2, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import StatCard from './components/StatCard';
import OrderList from './components/OrderList';
import Sidebar from './components/Sidebar';

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [orderTab, setOrderTab] = useState('checkout');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 3202,
    visitors: 1237,
    totalDelivery: 4256,
    totalCustomers: 5261,
    newOrders: 239,
    revenue: 3499.00,
    avgRevenue: 2168.00
  });

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // 模拟获取订单数据
    const mockOrders = [
      { id: '#2793299', name: 'Nelson Mandel', date: '10 Feb 2022', cost: 280.00, shippingCost: 10.00, status: 'PENDING' },
      { id: '#1273182', name: 'Hankum Muhammad', date: '10 Feb 2022', cost: 180.00, shippingCost: 20.00, status: 'PENDING' },
      { id: '#1451920', name: 'Brisk Sulivan', date: '10 Feb 2022', cost: 550.00, shippingCost: 30.00, status: 'SUCCESS' },
    ];
    setOrders(mockOrders);

    // 模拟生成图表数据
    const mockData = [];
    const dates = ['10 Feb', '11 Feb', '12 Feb', '13 Feb', '14 Feb', '15 Feb', '16 Feb', '17 Feb', '18 Feb'];

    for (let i = 0; i < dates.length; i++) {
      mockData.push({
        date: dates[i],
        value: 2000 + Math.random() * 3000
      });
    }
    setSalesData(mockData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 使用新的Sidebar组件 */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 主内容区 */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Recent Activity</h1>
          <div className="flex items-center">
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            percent={24.5}
            icon={<FiShoppingBag size={20} />}
            color="bg-orange-100"
            textColor="text-orange-500"
          />
          <StatCard
            title="Customers"
            value={stats.visitors}
            percent={24.5}
            icon={<FiUsers size={20} />}
            color="bg-indigo-100"
            textColor="text-indigo-500"
          />
          <StatCard
            title="Inventory"
            value={stats.totalDelivery}
            percent={24.5}
            icon={<FiTruck size={20} />}
            color="bg-green-100"
            textColor="text-green-500"
          />

          <StatCard
            title="Total Revenue"
            value={stats.totalDelivery}
            percent={24.5}
            icon={<FiTruck size={20} />}
            color="bg-green-100"
            textColor="text-green-500"
          />
        </div>

        

        {/* 销售统计 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Total Sales</h2>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Download PDF
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">New Orders</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.newOrders}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">24.4% ↑</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Revenue February</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${stats.revenue.toLocaleString()}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">24.4% ↑</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Average Revenue</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${stats.avgRevenue.toLocaleString()}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">24.4% ↑</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 6000]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Order List</h2>

            <div className="flex space-x-4 mt-4">
              <button
                className={`px-4 py-2 ${orderTab === 'checkout' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
                onClick={() => setOrderTab('checkout')}
              >
                Checkout
              </button>
              <button
                className={`px-4 py-2 ${orderTab === 'process' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
                onClick={() => setOrderTab('process')}
              >
                On Process
              </button>
              <button
                className={`px-4 py-2 ${orderTab === 'delivery' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
                onClick={() => setOrderTab('delivery')}
              >
                On Delivery
              </button>
            </div>
          </div>

          <OrderList orders={orders} />

          <div className="py-4 px-6 flex justify-between items-center">
            <span className="text-sm text-gray-600">Showing 3 of 100 entries</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 bg-gray-200 rounded">2</button>
              <button className="px-3 py-1 bg-gray-200 rounded">3</button>
              <button className="px-3 py-1 bg-gray-200 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//{!collapsed && (
//  <div className="absolute bottom-4 left-4 right-4">
//  <button className="w-full py-2 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg">
//    <FiLogOut className="mr-2" size={18} />
//    <span>Logoutf</span>
//  </button>
//</div>
//)}
