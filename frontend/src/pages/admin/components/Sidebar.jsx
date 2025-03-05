import { FiBarChart2, FiShoppingBag, FiMessageSquare, FiSettings, FiMenu, FiBox, FiUsers } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: '/admin/dashboard', 
      icon: <FiBarChart2 size={22} />, 
      label: 'Dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    { 
      path: '/admin/orders', 
      icon: <FiShoppingBag size={22} />, 
      label: 'Orders',
      active: location.pathname === '/admin/orders'
    },
    { 
      path: '/admin/inventory', 
      icon: <FiBox size={22} />, 
      label: 'Inventory',
      active: location.pathname === '/admin/inventory'
    },
    { 
      path: '/admin/customers', 
      icon: <FiUsers size={22} />, 
      label: 'Customers',
      active: location.pathname === '/admin/customers'
    },
    { 
      path: '/admin/messages', 
      icon: <FiMessageSquare size={22} />, 
      label: 'Messages',
      active: location.pathname === '/admin/messages'
    },
    { 
      path: '/admin/settings', 
      icon: <FiSettings size={22} />, 
      label: 'Settings',
      active: location.pathname === '/admin/settings'
    }
  ];


  return (
    <div className={`transition-all duration-300 h-[100vh] sticky top-0 bg-white shadow-md z-10 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="text-xl font-bold text-blue-600">ORDERAN</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-2 rounded hover:bg-gray-100"
        >
          <FiMenu className="text-gray-500" />
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`px-4 py-3 flex items-center ${
                  item.active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                } rounded-lg mx-2 mt-1`}
              >
                <span className={collapsed ? 'mx-auto' : 'mr-3'}>
                  {item.icon}
                </span>
                {!collapsed && <span className={item.active ? 'font-medium' : ''}>
                  {item.label}
                </span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      
    </div>
  );
} 