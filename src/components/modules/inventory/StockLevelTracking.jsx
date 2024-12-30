import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Package, AlertTriangle, Plus, History, ArrowUp, ArrowDown } from 'lucide-react';

const StockLevelTracking = ({ searchTerm, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdateAmount, setStockUpdateAmount] = useState('');
  const [updateType, setUpdateType] = useState('add');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*, stock_levels(current_stock, threshold_level, last_updated)');

      if (searchTerm) {
        query = query.or(`product_id.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct || !stockUpdateAmount) return;

    try {
      const amount = parseInt(stockUpdateAmount);
      const newStock = updateType === 'add' 
        ? (selectedProduct.stock_levels?.current_stock || 0) + amount
        : (selectedProduct.stock_levels?.current_stock || 0) - amount;

      if (newStock < 0) {
        alert('Stock cannot be negative');
        return;
      }

      const { error: stockError } = await supabase
        .from('stock_levels')
        .upsert({
          product_id: selectedProduct.id,
          current_stock: newStock,
          threshold_level: selectedProduct.stock_levels?.threshold_level || 10,
          last_updated: new Date().toISOString()
        });

      if (stockError) throw stockError;

      // Record stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: selectedProduct.id,
          movement_type: updateType,
          quantity: amount,
          previous_stock: selectedProduct.stock_levels?.current_stock || 0,
          new_stock: newStock
        });

      if (movementError) throw movementError;

      setSelectedProduct(null);
      setStockUpdateAmount('');
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

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

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const stockStatus = getStockStatus(product);
            const isLowStock = (product.stock_levels?.current_stock || 0) <= (product.stock_levels?.threshold_level || 10);

            return (
              <div
                key={product.id}
                className={`rounded-lg border transition-shadow hover:shadow-md ${
                  isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
                }`}
              >
                <div className="p-4">
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

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Update Stock</span>
                    </button>
                    <button
                      onClick={() => {/* Implement view history */}}
                      className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Update Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Stock - {selectedProduct.name}
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
                value={stockUpdateAmount}
                onChange={(e) => setStockUpdateAmount(e.target.value)}
                placeholder="Enter quantity"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                min="1"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockLevelTracking;