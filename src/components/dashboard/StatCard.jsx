import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changeType, isAlert }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border ${isAlert ? 'border-red-300' : 'border-gray-100'} hover:shadow-md transition-shadow duration-200`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm font-medium ${isAlert ? 'text-red-600' : 'text-gray-500'}`}>{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${isAlert ? 'text-red-700' : 'text-gray-900'}`}>{value}</h3>
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
      <div className={`p-3 rounded-lg ${isAlert ? 'bg-red-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
        <Icon className={`w-6 h-6 ${isAlert ? 'text-red-600' : 'text-blue-600'}`} />
      </div>
    </div>
  </div>
);

export default StatCard;