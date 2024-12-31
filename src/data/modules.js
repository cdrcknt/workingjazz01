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
    path: '/registration',
    component: 'ModuleContent'
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
    path: '/inventory',
    component: 'InventoryDashboard'
  },
  {
    id: 'promotions',
    icon: Tag,
    label: 'Promotions and Discounts',
    children: [
      { label: 'Create Promotion', path: '/promotions/create' },
      { label: 'Discount Application', path: '/promotions/discounts' },
      { label: 'Loyalty Program', path: '/promotions/loyalty' },
      { label: 'Active Promotions', path: '/promotions/active' }
    ]
  },
  {
    id: 'payment',
    icon: CreditCard,
    label: 'Payment',
    path: '/payment',
    component: 'PaymentModule'
  },
  {
    id: 'supplier',
    icon: Truck,
    label: 'Supplier',
    path: '/supplier',
    children: [
      { label: 'Add Supplier', path: '/supplier/add' },
      { label: 'Manage Suppliers', path: '/supplier/manage' },
      { label: 'Order History', path: '/supplier/history' }
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
    path: '/reports',
    component: 'ReportsModule'
  },
  {
    id: 'help',
    icon: HelpCircle,
    label: 'Help',
    path: '/help/user-manual',
    component: 'UserManual'
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