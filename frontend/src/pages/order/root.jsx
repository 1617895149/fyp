import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import Navbar from '../detail/components/Navbar';
import OrderItem from './components/OrderItem';
import OrderFilter from './components/OrderFilter';
import OrderStatusBadge from './components/OrderStatusBadge';
import EmptyOrders from './components/EmptyOrders';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [showFilter, setShowFilter] = useState(false);

  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8080/api/orders';
      if (statusFilter !== 'ALL') {
        url = `http://localhost:8080/api/orders/status/${statusFilter}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.code === 200) {
        setOrders(data.data);
      } else {
        console.error('获取订单失败:', data.message);
      }
    } catch (error) {
      console.error('获取订单错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时获取订单
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // 处理订单选择
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order.id)));
    }
  };

  // 处理展开/收起订单详情
  const handleToggleExpand = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // 批量删除订单
  const handleBatchDelete = async () => {
    if (selectedOrders.size === 0) return;
    
    if (!window.confirm(`确定要删除选中的 ${selectedOrders.size} 个订单吗？`)) {
      return;
    }

    try {
      // 这里应该是批量删除的API调用
      // 由于我们没有实现批量删除的后端API，这里只是模拟
      const deletePromises = Array.from(selectedOrders).map(orderId => 
        fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
          method: 'POST',
          credentials: 'include',
        })
      );

      await Promise.all(deletePromises);
      
      // 刷新订单列表
      fetchOrders();
      // 清空选中状态
      setSelectedOrders(new Set());
      
      alert('订单已成功取消');
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败，请重试');
    }
  };

  // 根据搜索词和状态过滤订单
  const filteredOrders = orders.filter(order => {
    // 搜索词过滤
    const searchMatch = 
      searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 日期过滤
    let dateMatch = true;
    if (dateFilter === 'TODAY') {
      const today = new Date();
      const orderDate = new Date(order.orderDate);
      dateMatch = 
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const orderDate = new Date(order.orderDate);
      dateMatch = orderDate >= weekAgo;
    } else if (dateFilter === 'MONTH') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const orderDate = new Date(order.orderDate);
      dateMatch = orderDate >= monthAgo;
    }
    
    return searchMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
          
          {selectedOrders.size > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <FiTrash2 className="mr-2" />
              取消选中订单 ({selectedOrders.size})
            </button>
          )}
        </div>
        
        {/* 搜索和筛选 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索订单号或客户名称"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              筛选
              {showFilter ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
            </button>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">所有时间</option>
              <option value="TODAY">今天</option>
              <option value="WEEK">最近一周</option>
              <option value="MONTH">最近一个月</option>
            </select>
          </div>
        </div>
        
        {/* 筛选面板 */}
        {showFilter && (
          <OrderFilter 
            statusFilter={statusFilter} 
            onStatusChange={setStatusFilter} 
          />
        )}
        
        {/* 订单列表 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* 表头 */}
            <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3">订单号</span>
              </div>
              <div>下单时间</div>
              <div>客户</div>
              <div>总金额</div>
              <div>状态</div>
              <div className="text-right">操作</div>
            </div>
            
            {/* 订单列表 */}
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <OrderItem
                  key={order.id}
                  order={order}
                  isSelected={selectedOrders.has(order.id)}
                  isExpanded={expandedOrders.has(order.id)}
                  onSelect={() => handleSelectOrder(order.id)}
                  onToggleExpand={() => handleToggleExpand(order.id)}
                />
              ))}
            </ul>
          </div>
        ) : (
          <EmptyOrders />
        )}
      </main>
    </div>
  );
}
