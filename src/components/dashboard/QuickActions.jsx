import React from 'react';
import { ShoppingBag, Package, BarChart2 } from 'lucide-react';

const actions = [
  { title: 'New Order', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { title: 'Add Product', icon: Package, color: 'bg-green-50 text-green-600' },
  { title: 'View Reports', icon: BarChart2, color: 'bg-purple-50 text-purple-600' },
];

const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
    <div className="space-y-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
        >
          <div className={`p-2 rounded-lg ${action.color} group-hover:opacity-80 transition-opacity duration-200`}>
            <action.icon className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-700">{action.title}</span>
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;