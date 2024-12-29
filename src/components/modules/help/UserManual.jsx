import React from 'react';
import { Book, Coffee, Users, Package, Clock, Calendar, DollarSign, Settings } from 'lucide-react';

const UserManual = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: Coffee,
      content: [
        'Login to your account using your credentials',
        'Navigate through modules using the sidebar',
        'Each module has specific functionalities for managing the coffee shop'
      ]
    },
    {
      title: 'Employee Management',
      icon: Users,
      content: [
        'Register new employees with complete information',
        'View and edit employee records',
        'Track attendance and work hours',
        'Manage employee schedules and shifts'
      ]
    },
    {
      title: 'Product Management',
      icon: Package,
      content: [
        'Add new products to the inventory',
        'Categorize products (Coffee, Milktea, etc.)',
        'Set and update product prices',
        'Monitor stock levels'
      ]
    },
    {
      title: 'Time Tracking',
      icon: Clock,
      content: [
        'Record employee clock-in/out times',
        'View attendance history',
        'Monitor work hours',
        'Generate time reports'
      ]
    },
    {
      title: 'Scheduling',
      icon: Calendar,
      content: [
        'Create employee work schedules',
        'Assign shifts and duties',
        'Manage time-off requests',
        'View schedule overview'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-sky-800 mb-2">User Manual</h3>
        <p className="text-sky-600">Learn how to use the Jazz Coffee Management System</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-sky-50 rounded-lg">
                <section.icon className="w-6 h-6 text-sky-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManual;