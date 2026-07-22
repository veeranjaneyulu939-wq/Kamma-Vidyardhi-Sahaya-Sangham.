import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, FileText, LogOut } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Mark Attendance', path: '/attendance', icon: <CheckSquare size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-navy text-white flex flex-col">
        <div className="p-4 flex flex-col items-center justify-center border-b border-gray-700">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-16 h-16 rounded-full border-2 border-gold mb-3 object-cover shadow-md"
          />
          <div className="text-center">
            <h1 className="text-gold font-bold text-lg">Kamma Hostel</h1>
            <p className="text-xs text-gray-300">Attendance System</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-gold text-navy font-semibold' : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-gray-800 transition-colors text-red-400"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-navy">
            {navItems.find(item => item.path === location.pathname)?.name || 'Welcome'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Admin / Warden</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
