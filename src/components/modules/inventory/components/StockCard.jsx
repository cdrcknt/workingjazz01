import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

const StockCard = ({ product, onUpdateClick, onHistoryClick }) => {
  const getStockStatus = (product) => {
    const currentStock = product.stock_levels?.current_stock || 0;
    const threshold = product.stock_levels?.threshold_level || 10;

    if (currentStock <= 0) {
      return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    } else if (currentStock <= threshold) {
      return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
    }
    return { color: 'bg-green-100 text-green-800', text: 'In Stock' };
  };

  const stockStatus = getStockStatus(product);
  const isLowStock = (product.stock_levels?.current_stock || 0) <= (product.stock_levels?.threshold_level || 10);

  return (
    <div className={`rounded-lg border transition-shadow hover:shadow-md ${
      isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
    }`}>
      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-100' : 'bg-blue-100'}`}>
              <Package className={`w-5 h-5 ${isLowStock ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500">ID: {product.product_id}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Stock Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Stock:</span>
            <span className="font-medium">{product.stock_levels?.current_stock || 0} units</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Threshold Level:</span>
            <span className="font-medium">{product.stock_levels?.threshold_level || 10} units</span>
          </div>
          {isLowStock && (
            <div className="flex items-center text-red-600 text-sm mt-2">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Stock below threshold</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onUpdateClick(product)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Stock
          </button>
          <button
            onClick={() => onHistoryClick(product)}
            className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockCard;