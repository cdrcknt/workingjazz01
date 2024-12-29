import { 
  UserPlus, Users, ShoppingBag, Package, 
  Tag, Clock, HelpCircle, Info, Settings,
  FileText, BarChart2, CreditCard, Truck
} from 'lucide-react';
import { MODULE_TYPES } from '../constants/moduleTypes';

export const modules = [
  {
    id: MODULE_TYPES.REGISTRATION,
    icon: UserPlus,
    label: 'Registration',
    children: [
      { label: 'Employee Registration', path: '/registration/employee' },
      { label: 'Product Registration', path: '/registration/product' }
    ]
  },
  {
    id: MODULE_TYPES.EMPLOYEE,
    icon: Users,
    label: 'Employee',
    children: [
      { label: 'Employee Records', path: '/employee/records' },
      { label: 'Time Tracking', path: '/employee/time-tracking' },
      { label: 'Scheduling', path: '/employee/scheduling' }
    ]
  },
  // ... rest of the modules configuration remains the same
];