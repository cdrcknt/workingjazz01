import React from 'react';
import { Coffee, Plus } from 'lucide-react';

const ProductCard = ({ product, onAdd }) => {
  return (
    <button
      onClick={() => onAdd(product)}
      className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
    >
      <div className="p-2 bg-orange-100 rounded-lg mr-3">
        <Coffee className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1 text-left">
        <h5 className="font-medium text-gray-900">{product.name}</h5>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
      <Plus className="w-5 h-5 text-gray-400" />
    </button>
  );
};

export default ProductCard;