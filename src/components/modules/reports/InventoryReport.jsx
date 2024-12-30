import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, Archive } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import ReportActions from './components/ReportActions';
import ReportHeader from './components/ReportHeader';
import { formatCurrency } from '../../../utils/reports/reportHelpers';
import { fetchInventoryData } from '../../../utils/reports/reportQueries';
import { generatePDF, generateExcel, generateCSV } from '../../../utils/reports/reportGenerator';

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [summary, setSummary] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalValue: 0,
    outOfStock: 0
  });

  useEffect(() => {
    fetchData();
  }, [filterCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchInventoryData();
      const filteredData = filterCategory === 'all'
        ? data
        : data.filter(item => item.category === filterCategory);
      
      setInventoryData(filteredData);
      calculateSummary(filteredData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalProducts = data.length;
    const lowStockItems = data.filter(item => 
      item.stock_levels?.current_stock <= item.stock_levels?.threshold_level
    ).length;
    const totalValue = data.reduce((sum, item) => 
      sum + (item.price * (item.stock_levels?.current_stock || 0)), 0
    );
    const outOfStock = data.filter(item => 
      !item.stock_levels?.current_stock || item.stock_levels.current_stock === 0
    ).length;

    setSummary({
      totalProducts,
      lowStockItems,
      totalValue,
      outOfStock
    });
  };

  const handleDownload = async (format) => {
    const reportTitle = 'Inventory Status Report';
    const dateRange = { 
      start: new Date().toISOString(),
      end: new Date().toISOString()
    };

    const formattedData = inventoryData.map(item => ({
      'Product ID': item.product_id,
      'Name': item.name,
      'Category': item.category,
      'Current Stock': item.stock_levels?.current_stock || 0,
      'Threshold': item.stock_levels?.threshold_level || 0,
      'Unit Price': formatCurrency(item.price),
      'Total Value': formatCurrency(item.price * (item.stock_levels?.current_stock || 0)),
      'Status': item.stock_levels?.current_stock <= item.stock_levels?.threshold_level ? 'Low Stock' : 'In Stock'
    }));

    switch (format) {
      case 'pdf':
        const doc = generatePDF(formattedData, reportTitle, dateRange);
        doc.save('inventory-report.pdf');
        break;
      case 'excel':
        const wb = generateExcel(formattedData, reportTitle);
        XLSX.writeFile(wb, 'inventory-report.xlsx');
        break;
      case 'csv':
        const csv = generateCSV(formattedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory-report.csv';
        a.click();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Inventory Status Report"
        subtitle="Track stock levels and inventory value"
        color="amber"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="Coffee">Coffee</option>
                <option value="Milktea">Milktea</option>
                <option value="Frappe">Frappe</option>
                <option value="Non-Coffee">Non-Coffee</option>
              </select>
            </div>
            <ReportActions onDownload={handleDownload} isLoading={loading} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-amber-900">Total Products</h4>
              </div>
              <p className="text-2xl font-bold text-amber-900">{summary.totalProducts}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-red-900">Low Stock Items</h4>
              </div>
              <p className="text-2xl font-bold text-red-900">{summary.lowStockItems}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Archive className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Total Value</h4>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(summary.totalValue)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gray-500/10 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-gray-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Out of Stock</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.outOfStock}</p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Current Stock</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Threshold</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Unit Price</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total Value</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
                        <span>Loading inventory data...</span>
                      </div>
                    </td>
                  </tr>
                ) : inventoryData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No inventory data available
                    </td>
                  </tr>
                ) : (
                  inventoryData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{item.product_id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {item.stock_levels?.current_stock || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {item.stock_levels?.threshold_level || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(item.price * (item.stock_levels?.current_stock || 0))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          !item.stock_levels?.current_stock || item.stock_levels.current_stock === 0
                            ? 'bg-red-100 text-red-800'
                            : item.stock_levels.current_stock <= item.stock_levels.threshold_level
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {!item.stock_levels?.current_stock || item.stock_levels.current_stock === 0
                            ? 'Out of Stock'
                            : item.stock_levels.current_stock <= item.stock_levels.threshold_level
                            ? 'Low Stock'
                            : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;