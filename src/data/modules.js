import { 
  UserPlus, Users, ShoppingBag, Package, 
  Tag, Clock, HelpCircle, Info, Settings,
  FileText, BarChart2, CreditCard, Truck
} from 'lucide-react';

export const modules = [
  {
    id: 'registration',
    icon: UserPlus,
    label: 'Registration',
    children: [
      { label: 'Employee Registration', path: '/registration/employee' },
      { label: 'Product Registration', path: '/registration/product' }
    ]
  },
  {
    id: 'employee',
    icon: Users,
    label: 'Employee',
    children: [
      { label: 'Employee Records', path: '/employee/records' },
      { label: 'Time Tracking', path: '/employee/time-tracking' },
      { label: 'Scheduling', path: '/employee/scheduling' }
    ]
  },
  {
    id: 'order',
    icon: ShoppingBag,
    label: 'Order Management',
    children: [
      { label: 'New Order', path: '/order/new' },
      { label: 'Order Queue', path: '/order/queue' },
      { label: 'Order History', path: '/order/history' }
    ]
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Inventory',
    children: [
      { label: 'Stock Levels', path: '/inventory/stock' },
      { label: 'Reorder Items', path: '/inventory/reorder' }
    ]
  },
  {
    id: 'promotions',
    icon: Tag,
    label: 'Promotions',
    children: [
      { label: 'Create Promotion', path: '/promotions/create' },
      { label: 'Active Promotions', path: '/promotions/active' }
    ]
  },
  {
    id: 'payment',
    icon: CreditCard,
    label: 'Payment',
    children: [
      { label: 'Process Payment', path: '/payment/process' },
      { label: 'Transaction History', path: '/payment/history' }
    ]
  },
  {
    id: 'supplier',
    icon: Truck,
    label: 'Supplier',
    children: [
      { label: 'Supplier List', path: '/supplier/list' },
      { label: 'Purchase Orders', path: '/supplier/orders' }
    ]
  },
  {
    id: 'maintenance',
    icon: Settings,
    label: 'Maintenance',
    children: [
      { label: 'Update Records', path: '/maintenance/update-records' },
      { label: 'Archive', path: '/maintenance/archive' },
      { label: 'Backup', path: '/maintenance/backup' }
    ]
  },
  {
    id: 'reports',
    icon: BarChart2,
    label: 'Reports',
    children: [
      { label: 'Sales Reports', path: '/reports/sales' },
      { label: 'Inventory Reports', path: '/reports/inventory' }
    ]
  },
  {
    id: 'help',
    icon: HelpCircle,
    label: 'Help',
    children: [
      { label: 'User Manual', path: '/help/user-manual' }
    ]
  },
  {
    id: 'about',
    icon: Info,
    label: 'About',
    children: [
      { label: 'System', path: '/about/system' },
      { label: 'Developers', path: '/about/developers' }
    ]
  }
];