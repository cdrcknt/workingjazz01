import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Package } from 'lucide-react';

const RegistrationModule = () => {
  const navigate = useNavigate();

  const registrationOptions = [
    {
      title: 'Employee Registration',
      description: 'Register new employees and manage their accounts',
      icon: UserPlus,
      path: '/dashboard/registration/employee',
      color: 'bg-blue-100 text-blue-600',
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Product Registration',
      description: 'Add new products to the inventory system',
      icon: Package,
      path: '/dashboard/registration/product',
      color: 'bg-amber-100 text-amber-600',
      gradient: 'from-amber-50 to-amber-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-indigo-800 mb-2">Registration</h3>
        <p className="text-indigo-600">Manage employee and product registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registrationOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className={`bg-gradient-to-br ${option.gradient} p-6`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${option.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{option.title}</h4>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <button
                  onClick={() => navigate(option.path)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    index === 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  Go to {option.title}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationModule;