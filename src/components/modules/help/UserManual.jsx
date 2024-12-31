import React from 'react';
import { 
  Coffee, Users, Package, Clock, Calendar, DollarSign, 
  Tag, ShoppingBag, Truck, BarChart2, Settings, CreditCard
} from 'lucide-react';

const UserManual = () => {
  const sections = [
    {
      title: 'Dashboard',
      icon: Coffee,
      content: [
        'View key metrics and statistics',
        'Monitor daily sales and revenue',
        'Track active staff and inventory status',
        'Access quick actions for common tasks',
        'View recent orders and their status'
      ]
    },
    {
      title: 'Registration',
      icon: Users,
      content: [
        'Register new employees with complete information',
        'Add new products to the system',
        'Set product prices and categories',
        'Manage product details and availability'
      ]
    },
    {
      title: 'Employee Management',
      icon: Users,
      subsections: [
        {
          title: 'Employee Records',
          content: [
            'View and manage employee information',
            'Update employee details and roles',
            'Track employee performance',
            'Manage access permissions'
          ]
        },
        {
          title: 'Time Tracking',
          content: [
            'Record employee clock-in/out times',
            'Monitor work hours and attendance',
            'Generate timesheet reports',
            'Track overtime and breaks'
          ]
        },
        {
          title: 'Scheduling',
          content: [
            'Create and manage employee schedules',
            'Assign shifts and duties',
            'Handle time-off requests',
            'View schedule conflicts'
          ]
        }
      ]
    },
    {
      title: 'Inventory Management',
      icon: Package,
      content: [
        'Track stock levels and inventory movement',
        'Set up low stock alerts',
        'Monitor product usage and wastage',
        'Generate inventory reports',
        'Manage stock transfers and adjustments'
      ]
    },
    {
      title: 'Order Management',
      icon: ShoppingBag,
      subsections: [
        {
          title: 'New Order',
          content: [
            'Create new customer orders',
            'Add products and customizations',
            'Apply discounts and promotions',
            'Calculate total amount'
          ]
        },
        {
          title: 'Order Queue',
          content: [
            'View and manage ongoing orders',
            'Track order status and progress',
            'Handle order modifications',
            'Process order completion'
          ]
        }
      ]
    },
    {
      title: 'Payment Processing',
      icon: CreditCard,
      subsections: [
        {
          title: 'Payment Methods',
          content: [
            'Process cash payments',
            'Handle card transactions',
            'Manage digital payments',
            'Issue receipts and invoices'
          ]
        },
        {
          title: 'Financial Reconciliation',
          content: [
            'Balance daily transactions',
            'Handle cash counts',
            'Manage discrepancies',
            'Generate financial reports'
          ]
        }
      ]
    },
    {
      title: 'Supplier Management',
      icon: Truck,
      subsections: [
        {
          title: 'Supplier Records',
          content: [
            'Add and manage supplier information',
            'Track supplier performance',
            'Manage supplier contracts',
            'Update supplier details'
          ]
        },
        {
          title: 'Order Management',
          content: [
            'Create purchase orders',
            'Track deliveries and receipts',
            'Manage supplier invoices',
            'Handle returns and refunds'
          ]
        }
      ]
    },
    {
      title: 'Reports',
      icon: BarChart2,
      content: [
        'Generate sales reports',
        'View inventory analytics',
        'Track employee performance',
        'Monitor financial metrics',
        'Export data in multiple formats'
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Jazz Coffee Management System</h2>
        <p className="text-blue-100 text-lg">Comprehensive User Guide</p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h3>
        <p className="text-gray-600 leading-relaxed">
          Welcome to the Jazz Coffee Management System user manual. This guide provides detailed information about all system features and functionalities. Each section contains step-by-step instructions to help you effectively manage your coffee shop operations.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
              </div>
            </div>
            
            <div className="p-6">
              {section.subsections ? (
                <div className="space-y-6">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{subsection.title}</h4>
                      <ul className="space-y-2">
                        {subsection.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2 text-gray-600">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-gray-600">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
        <p className="text-gray-600 leading-relaxed">
          If you need additional assistance or have questions not covered in this manual, please contact our support team:
        </p>
        <div className="mt-4 space-y-2 text-gray-600">
          <p>Email: support@jazzcoffee.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default UserManual;