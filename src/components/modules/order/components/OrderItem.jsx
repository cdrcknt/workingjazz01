import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const OrderItem = ({ item, index, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h5 className="font-medium text-gray-900">{item.product.name}</h5>
        <div className="flex items-center mt-1">
          <button
            onClick={() => onUpdateQuantity(index, -1)}
            className="p-1 text-gray-500 hover:bg-gray-200 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="mx-2 font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(index, 1)}
            className="p-1 text-gray-500 hover:bg-gray-200 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">
          ${item.subtotal.toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(index)}
          className="p-1 text-red-500 hover:bg-red-50 rounded mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;