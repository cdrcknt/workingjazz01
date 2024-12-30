import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StockUpdateModal = ({ 
  product, 
  updateType, 
  setUpdateType, 
  stockAmount, 
  setStockAmount, 
  onUpdate, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Update Stock - {product.name}
        </h3>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setUpdateType('add')}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${
                updateType === 'add'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
            <button
              onClick={() => setUpdateType('remove')}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${
                updateType === 'remove'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
              <span>Remove Stock</span>
            </button>
          </div>

          <input
            type="number"
            value={stockAmount}
            onChange={(e) => setStockAmount(e.target.value)}
            placeholder="Enter quantity"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            min="1"
          />

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateModal;