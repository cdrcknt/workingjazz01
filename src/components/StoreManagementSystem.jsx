import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ModuleItem from './sidebar/ModuleItem';
import DashboardContent from './dashboard/DashboardContent';
import { modules } from '../data/modules';
import { LogOut, Home } from 'lucide-react';

const EMPLOYEE_MODULES = [
  'dashboard',
  'order',
  'inventory',
  'promotions',
  'payment',
  'help',
  'about'
];

// Define default routes for modules with children
const DEFAULT_ROUTES = {
  employee: '/dashboard/employee/records',
  order: '/dashboard/order/new',
  promotions: '/dashboard/promotions/create',
  supplier: '/dashboard/supplier/add',
  maintenance: '/dashboard/maintenance/update-records',
  about: '/dashboard/about/system'
};

// Define modules that have dropdowns
const DROPDOWN_MODULES = ['employee', 'order', 'promotions', 'supplier', 'maintenance', 'about'];

export default function StoreManagementSystem() {
  const [openModules, setOpenModules] = useState({});
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleModule = (moduleId) => {
    // If clicking a module without dropdown, close all dropdowns
    if (!DROPDOWN_MODULES.includes(moduleId)) {
      setOpenModules({});
    } else {
      // If clicking a dropdown module, close others and toggle this one
      setOpenModules(prev => ({
        ...Object.fromEntries(DROPDOWN_MODULES.map(id => [id, false])), // Close all dropdowns
        [moduleId]: !prev[moduleId] // Toggle clicked module
      }));
    }
    
    if (moduleId !== activeModule) {
      setActiveModule(moduleId);
      // Navigate to default route if module has one
      if (DEFAULT_ROUTES[moduleId]) {
        navigate(DEFAULT_ROUTES[moduleId]);
      } else {
        navigate(`/dashboard/${moduleId}`);
      }
    }
  };

  const handleDashboard = () => {
    setOpenModules({}); // Close all dropdowns
    setActiveModule('dashboard');
    navigate('/dashboard');
  };

  // Filter modules based on user role
  const filteredModules = modules.filter(module => 
    user?.role === 'admin' || EMPLOYEE_MODULES.includes(module.id)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500">
          <h1 className="text-xl font-bold text-white">Jazz Coffee</h1>
          <p className="text-sm text-blue-100">Store Management System</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={handleDashboard}
            className={`w-full flex items-center p-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 mb-1 ${
              activeModule === 'dashboard' ? 'bg-blue-50 text-blue-600 font-medium' : ''
            }`}
          >
            <Home className={`w-5 h-5 mr-2.5 ${activeModule === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Dashboard</span>
          </button>

          {filteredModules.map((module) => (
            <ModuleItem
              key={module.id}
              icon={module.icon}
              label={module.label}
              isOpen={openModules[module.id]}
              onClick={() => toggleModule(module.id)}
              children={module.children}
              isActive={activeModule === module.id}
            />
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-4"
          >
            <LogOut className="w-5 h-5 mr-2.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50">
        {activeModule === 'dashboard' ? (
          <DashboardContent user={user} />
        ) : (
          <Outlet context={{ user }} />
        )}
      </div>
    </div>
  );
}