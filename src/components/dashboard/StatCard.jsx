import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
        {change && (
          <p className={`text-sm mt-2 flex items-center ${
            changeType === 'increase' ? 'text-green-600' : 
            changeType === 'decrease' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {changeType === 'increase' ? <ChevronUp className="w-4 h-4" /> : 
             changeType === 'decrease' ? <ChevronDown className="w-4 h-4" /> : null}
            {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export default StatCard;