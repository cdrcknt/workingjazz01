import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { TrendingUp, Calendar, DollarSign, BarChart2 } from 'lucide-react';

const ProductSalesTracking = ({ searchTerm, selectedCategory }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, [searchTerm, selectedCategory, dateRange]);

  const fetchSalesData = async () => {
    try {
      let query = supabase
        .from('order_items')
        .select(`
          quantity,
          unit_price,
          subtotal,
          created_at,
          products (
            id,
            name,
            product_id,
            category
          )
        `)
        .order('created_at', { ascending: false });

      // Apply date range filter
      const now = new Date();
      let startDate;
      switch (dateRange) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      query = query.gte('created_at', startDate.toISOString());

      if (selectedCategory !== 'all') {
        query = query.eq('products.category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Process and aggregate sales data
      const aggregatedData = data.reduce((acc, item) => {
        const productId = item.products.id;
        if (!acc[productId]) {
          acc[productId] = {
            product: item.products,
            totalQuantity: 0,
            totalRevenue: 0,
            salesCount: 0
          };
        }
        acc[productId].totalQuantity += item.quantity;
        acc[productId].totalRevenue += item.subtotal;
        acc[productId].salesCount += 1;
        return acc;
      }, {});

      setSalesData(Object.values(aggregatedData));
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setDateRange('week')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            dateRange === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>This Week</span>
        </button>
        <button
          onClick={() => setDateRange('month')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            dateRange === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>This Month</span>
        </button>
        <button
          onClick={() => setDateRange('year')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            dateRange === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>This Year</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading sales data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salesData.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">ID: {item.product.product_id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-medium text-gray-900">{item.totalQuantity} units</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-medium text-gray-900">
                      ${item.totalRevenue.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Orders</span>
                    <span className="font-medium text-gray-900">{item.salesCount}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Avg. Order Value</span>
                    <span className="font-medium text-gray-900">
                      ${(item.totalRevenue / item.salesCount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(item.product)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sales Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Details - {selectedProduct.name}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Add detailed sales charts and analytics here */}
            <div className="text-center text-gray-500 py-8">
              Detailed analytics coming soon...
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSalesTracking;