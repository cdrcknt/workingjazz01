import React, { useState, useEffect } from 'react';
import { BarChart2, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import DateRangePicker from './components/DateRangePicker';
import ReportActions from './components/ReportActions';
import ReportHeader from './components/ReportHeader';
import { formatCurrency, calculateDateRange } from '../../../utils/reports/reportHelpers';
import { fetchSalesData } from '../../../utils/reports/reportQueries';
import { generatePDF, generateExcel, generateCSV } from '../../../utils/reports/reportGenerator';

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchSalesData(startDate, endDate);
      setSalesData(data);
      calculateSummary(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalSales = data.reduce((sum, item) => sum + item.final_amount, 0);
    const totalOrders = data.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    setSummary({
      totalSales,
      totalOrders,
      averageOrderValue
    });
  };

  const handleDownload = async (format) => {
    const reportTitle = 'Sales Report';
    const dateRange = { start: startDate, end: endDate };

    const formattedData = salesData.map(sale => ({
      'Order Number': sale.orders.order_number,
      'Date': new Date(sale.created_at).toLocaleDateString(),
      'Items': sale.orders.order_items.length,
      'Subtotal': formatCurrency(sale.total_amount),
      'Discount': formatCurrency(sale.discount_amount),
      'Final Amount': formatCurrency(sale.final_amount)
    }));

    switch (format) {
      case 'pdf':
        const doc = generatePDF(formattedData, reportTitle, dateRange);
        doc.save('sales-report.pdf');
        break;
      case 'excel':
        const wb = generateExcel(formattedData, reportTitle);
        XLSX.writeFile(wb, 'sales-report.xlsx');
        break;
      case 'csv':
        const csv = generateCSV(formattedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales-report.csv';
        a.click();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Sales Report"
        subtitle="Analyze sales performance and trends"
        color="blue"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Total Sales</h4>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(summary.totalSales)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-900">Total Orders</h4>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {summary.totalOrders}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-purple-900">Average Order</h4>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(summary.averageOrderValue)}
              </p>
            </div>
          </div>

          {/* Sales Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Subtotal</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Discount</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Final Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        <span>Loading sales data...</span>
                      </div>
                    </td>
                  </tr>
                ) : salesData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No sales data available for the selected period
                    </td>
                  </tr>
                ) : (
                  salesData.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{sale.orders.order_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(sale.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sale.orders.order_items.length}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(sale.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 text-right">
                        -{formatCurrency(sale.discount_amount)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(sale.final_amount)}
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

export default SalesReport;