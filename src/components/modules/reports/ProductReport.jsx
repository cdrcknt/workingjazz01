import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import DateRangePicker from './components/DateRangePicker';
import ReportActions from './components/ReportActions';
import ReportHeader from './components/ReportHeader';
import { formatCurrency } from '../../../utils/reports/reportHelpers';
import { fetchProductData } from '../../../utils/reports/reportQueries';
import { generatePDF, generateExcel, generateCSV } from '../../../utils/reports/reportGenerator';

const ProductReport = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    topCategory: '',
    averagePrice: 0
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchProductData(startDate, endDate);
      
      // Process and aggregate data
      const aggregatedData = data.reduce((acc, item) => {
        const productId = item.products.id;
        if (!acc[productId]) {
          acc[productId] = {
            name: item.products.name,
            category: item.products.category,
            quantity: 0,
            revenue: 0,
            averagePrice: 0
          };
        }
        acc[productId].quantity += item.quantity;
        acc[productId].revenue += item.quantity * item.unit_price;
        acc[productId].averagePrice = acc[productId].revenue / acc[productId].quantity;
        return acc;
      }, {});

      const processedData = Object.values(aggregatedData);
      setProductData(processedData);
      calculateSummary(processedData);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalProducts = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const categoryCount = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    const averagePrice = totalRevenue / data.reduce((sum, item) => sum + item.quantity, 0);

    setSummary({
      totalProducts,
      totalRevenue,
      topCategory,
      averagePrice
    });
  };

  const handleDownload = async (format) => {
    const reportTitle = 'Product Performance Report';
    const dateRange = { start: startDate, end: endDate };

    const formattedData = productData.map(product => ({
      'Product Name': product.name,
      'Category': product.category,
      'Quantity Sold': product.quantity,
      'Average Price': formatCurrency(product.averagePrice),
      'Total Revenue': formatCurrency(product.revenue)
    }));

    switch (format) {
      case 'pdf':
        const doc = generatePDF(formattedData, reportTitle, dateRange);
        doc.save('product-report.pdf');
        break;
      case 'excel':
        const wb = generateExcel(formattedData, reportTitle);
        XLSX.writeFile(wb, 'product-report.xlsx');
        break;
      case 'csv':
        const csv = generateCSV(formattedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product-report.csv';
        a.click();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Product Performance Report"
        subtitle="Track product sales and popularity"
        color="green"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <ReportActions onDownload={handleDownload} isLoading={loading} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-900">Total Products</h4>
              </div>
              <p className="text-2xl font-bold text-green-900">{summary.totalProducts}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Total Revenue</h4>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-purple-900">Top Category</h4>
              </div>
              <p className="text-2xl font-bold text-purple-900">{summary.topCategory}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-amber-900">Average Price</h4>
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {formatCurrency(summary.averagePrice)}
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Quantity Sold</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Average Price</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                        <span>Loading product data...</span>
                      </div>
                    </td>
                  </tr>
                ) : productData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No product data available for the selected period
                    </td>
                  </tr>
                ) : (
                  productData.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{product.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(product.averagePrice)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(product.revenue)}
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

export default ProductReport;