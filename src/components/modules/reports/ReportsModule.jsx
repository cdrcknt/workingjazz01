import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, ShoppingBag, Package, 
  Users, ClipboardList, DollarSign 
} from 'lucide-react';

const ReportsModule = () => {
  const navigate = useNavigate();

  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'View detailed sales analytics and trends',
      icon: BarChart2,
      color: 'bg-blue-100 text-blue-600',
      path: '/dashboard/reports/sales'
    },
    {
      id: 'products',
      title: 'Product Report',
      description: 'Analyze product performance and popularity',
      icon: ShoppingBag,
      color: 'bg-green-100 text-green-600',
      path: '/dashboard/reports/products'
    },
    {
      id: 'services',
      title: 'Service Report',
      description: 'Track service efficiency and customer satisfaction',
      icon: ClipboardList,
      color: 'bg-purple-100 text-purple-600',
      path: '/dashboard/reports/services'
    },
    {
      id: 'user-logs',
      title: 'User Logs',
      description: 'Monitor user activities and system access',
      icon: Users,
      color: 'bg-amber-100 text-amber-600',
      path: '/dashboard/reports/user-logs'
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Track stock levels and inventory movement',
      icon: Package,
      color: 'bg-indigo-100 text-indigo-600',
      path: '/dashboard/reports/inventory'
    },
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'View comprehensive financial analytics',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600',
      path: '/dashboard/reports/financial'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports</h3>
        <p className="text-gray-600">Generate and analyze business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => navigate(report.path)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${report.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{report.title}</h4>
                  <p className="text-gray-500 mt-1">{report.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsModule;