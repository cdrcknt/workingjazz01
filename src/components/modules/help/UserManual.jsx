import React from 'react';
import { 
  Coffee, Users, Package, Clock, Calendar, DollarSign, 
  Tag, ShoppingBag, Truck, BarChart2, Settings, CreditCard,
  FileText, Info, HelpCircle, Archive, Database
} from 'lucide-react';

const UserManual = () => {
  const sections = [
    {
      title: 'Dashboard',
      icon: Coffee,
      content: [
        'View key business metrics and statistics',
        'Monitor daily sales and revenue',
        'Track active staff and inventory status',
        'Access quick actions for common tasks',
        'View recent orders and their status',
        'Monitor low stock alerts'
      ]
    },
    {
      title: 'Registration',
      icon: Users,
      content: [
        'Register new employees with complete information',
        'Add new products to the inventory system',
        'Set product prices and categories',
        'Manage product details and availability',
        'Upload product images and descriptions'
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
            'Track employee performance metrics',
            'Manage access permissions and security',
            'View employment history and documentation'
          ]
        },
        {
          title: 'Time Tracking',
          content: [
            'Record employee clock-in/out times',
            'Monitor work hours and attendance',
            'Generate timesheet reports',
            'Track overtime and breaks',
            'Manage leave requests and approvals'
          ]
        },
        {
          title: 'Scheduling',
          content: [
            'Create and manage employee schedules',
            'Assign shifts and duties',
            'Handle time-off requests',
            'View schedule conflicts',
            'Optimize staff allocation'
          ]
        }
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
            'Calculate total amount',
            'Process payments and generate receipts'
          ]
        },
        {
          title: 'Order Queue',
          content: [
            'View and manage ongoing orders',
            'Track order status and progress',
            'Handle order modifications',
            'Process order completion',
            'Manage order priorities'
          ]
        }
      ]
    },
    {
      title: 'Inventory Management',
      icon: Package,
      content: [
        'Track stock levels in real-time',
        'Set up low stock alerts and thresholds',
        'Monitor product usage and wastage',
        'Generate inventory reports',
        'Manage stock transfers and adjustments',
        'Track product expiration dates',
        'Analyze inventory turnover rates'
      ]
    },
    {
      title: 'Promotions and Discounts',
      icon: Tag,
      subsections: [
        {
          title: 'Create Promotion',
          content: [
            'Create new promotional campaigns',
            'Set discount rates and conditions',
            'Define promotion duration',
            'Target specific products or categories',
            'Set up seasonal promotions'
          ]
        },
        {
          title: 'Discount Application',
          content: [
            'Apply discounts to orders',
            'Manage special pricing rules',
            'Handle coupon codes',
            'Process bulk discounts'
          ]
        },
        {
          title: 'Loyalty Program',
          content: [
            'Manage customer loyalty points',
            'Set up reward tiers',
            'Track customer rewards',
            'Process point redemption',
            'Analyze program effectiveness'
          ]
        }
      ]
    },
    {
      title: 'Payment Management',
      icon: CreditCard,
      subsections: [
        {
          title: 'Payment Processing',
          content: [
            'Process various payment methods',
            'Handle cash transactions',
            'Manage card payments',
            'Generate receipts',
            'Process refunds'
          ]
        },
        {
          title: 'Financial Reconciliation',
          content: [
            'Balance daily transactions',
            'Manage cash counts',
            'Handle discrepancies',
            'Generate financial reports',
            'Track payment history'
          ]
        }
      ]
    },
    {
      title: 'Supplier Management',
      icon: Truck,
      subsections: [
        {
          title: 'Add Supplier',
          content: [
            'Register new suppliers',
            'Manage supplier information',
            'Set payment terms',
            'Define delivery methods',
            'Track supplier performance'
          ]
        },
        {
          title: 'Manage Suppliers',
          content: [
            'Update supplier details',
            'Track supplier history',
            'Manage supplier contracts',
            'Rate supplier performance',
            'Handle supplier communications'
          ]
        },
        {
          title: 'Order History',
          content: [
            'View purchase history',
            'Track deliveries',
            'Manage invoices',
            'Monitor order status',
            'Analyze supplier reliability'
          ]
        }
      ]
    },
    {
      title: 'Maintenance',
      icon: Settings,
      subsections: [
        {
          title: 'Update Records',
          content: [
            'Update system records',
            'Manage data accuracy',
            'Clean up obsolete data',
            'Verify data integrity'
          ]
        },
        {
          title: 'Archive',
          content: [
            'Archive old records',
            'Manage archived data',
            'Restore archived items',
            'Maintain data history'
          ]
        },
        {
          title: 'Backup',
          content: [
            'Create system backups',
            'Schedule automatic backups',
            'Restore from backups',
            'Manage backup storage'
          ]
        }
      ]
    },
    {
      title: 'Reports',
      icon: BarChart2,
      subsections: [
        {
          title: 'Sales Reports',
          content: [
            'Generate sales analytics',
            'View revenue trends', 
            'Analyze sales performance',
            'Export reports in multiple formats',
            'Track daily/monthly/yearly sales',
            'Monitor sales by category'
          ]
        },
        {
          title: 'Product Reports',
          content: [
            'Analyze product performance and popularity',
            'Track product sales trends',
            'Monitor product categories',
            'View average product prices',
            'Export in PDF/Excel/CSV formats',
            'Access detailed product analytics'
          ]
        },
        {
          title: 'Service Reports',
          content: [
            'Track service efficiency metrics',
            'Monitor customer satisfaction ratings',
            'Analyze service preparation times',
            'View peak service hours',
            'Track order status and completion',
            'Export service performance data'
          ]
        },
        {
          title: 'User Logs',
          content: [
            'Monitor user activities',
            'Track system access and usage',
            'View activity by module',
            'Analyze peak usage times',
            'Export detailed user logs',
            'Monitor IP addresses and access points'
          ]
        },
        {
          title: 'Inventory Reports',
          content: [
            'Track stock movements',
            'Monitor product performance',
            'Analyze stock turnover',
            'Identify slow-moving items',
            'View inventory valuations',
            'Generate stock alerts'
          ]
        },
        {
          title: 'Financial Summary',
          content: [
            'Generate profit/loss statements',
            'View financial summaries',
            'Track expenses and revenues',
            'Analyze financial trends',
            'Monitor cash flow',
            'Export financial reports'
          ]
        }
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
          Welcome to the Jazz Coffee Management System user manual. This comprehensive guide provides detailed information about all system features and functionalities. Each section contains step-by-step instructions to help you effectively manage your coffee shop operations.
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