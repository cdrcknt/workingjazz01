import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, Package } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import StatCard from './StatCard';
import QuickActions from './QuickActions';

const DashboardContent = ({ user }) => {
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_levels')
        .select('*')
        .lt('current_stock', 10);

      if (error) throw error;
      setLowStockCount(data.length);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Welcome Back!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Today's Orders"
            value="0"
            icon={ShoppingBag}
            change="No previous data"
            changeType="neutral"
          />
          <StatCard
            title="Total Sales"
            value="$0"
            icon={DollarSign}
            change="No previous data"
            changeType="neutral"
          />
          <StatCard
            title="Active Staff"
            value="1"
            icon={Users}
            change="Initial staff"
            changeType="neutral"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockCount.toString()}
            icon={Package}
            change="Items below threshold"
            changeType="neutral"
            isAlert={lowStockCount > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
                  View All
                </button>
              </div>
              <div className="text-center text-gray-500 py-8">
                No orders available yet
              </div>
            </div>
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;