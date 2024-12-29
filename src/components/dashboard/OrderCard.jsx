import React from 'react';
import { Coffee, Clock } from 'lucide-react';

const OrderCard = ({ order }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Coffee className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
          <p className="text-sm text-gray-500">{order.items} items</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {order.status}
      </span>
    </div>
    <div className="flex justify-between items-center text-sm">
      <p className="text-gray-500 flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        {order.time}
      </p>
      <p className="font-medium text-gray-900">${order.total}</p>
    </div>
  </div>
);

export default OrderCard;