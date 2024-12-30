import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Search, Package, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import StockLevelTracking from './StockLevelTracking';
import ProductSalesTracking from './ProductSalesTracking';

const InventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('stock');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .distinct();

      if (error) throw error;
      setCategories(data.map(item => item.category));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Inventory Management</h3>
        <p className="text-blue-600">Track and manage your product inventory</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by product ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 w-full md:w-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('stock')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'stock'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Stock Level Tracking</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'sales'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Product Sales Tracking</span>
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'stock' ? (
          <StockLevelTracking 
            searchTerm={searchTerm} 
            selectedCategory={selectedCategory} 
          />
        ) : (
          <ProductSalesTracking 
            searchTerm={searchTerm} 
            selectedCategory={selectedCategory} 
          />
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;