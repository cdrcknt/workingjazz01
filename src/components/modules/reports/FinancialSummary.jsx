import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import DateRangePicker from './components/DateRangePicker';
import ReportActions from './components/ReportActions';
import ReportHeader from './components/ReportHeader';
import { formatCurrency } from '../../../utils/reports/reportHelpers';
import { generatePDF, generateExcel, generateCSV } from '../../../utils/reports/reportGenerator';

const FinancialSummary = () => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    averageOrderValue: 0,
    topExpenseCategory: ''
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch revenue data (transactions)
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (transactionError) throw transactionError;

      // Fetch expense data (supplier orders)
      const { data: expenses, error: expenseError } = await supabase
        .from('supplier_orders')
        .select(`
          *,
          suppliers (
            company_name,
            category
          )
        `)
        .gte('order_date', startDate)
        .lte('order_date', endDate);

      if (expenseError) throw expenseError;

      const processedData = processFinancialData(transactions, expenses);
      setFinancialData(processedData);
      calculateSummary(transactions, expenses);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processFinancialData = (transactions, expenses) => {
    // Group data by date
    const dailyData = {};

    // Process transactions (revenue)
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          expenses: 0,
          transactions: 0,
          profit: 0
        };
      }
      dailyData[date].revenue += transaction.final_amount;
      dailyData[date].transactions += 1;
    });

    // Process expenses
    expenses.forEach(expense => {
      const date = new Date(expense.order_date).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          expenses: 0,
          transactions: 0,
          profit: 0
        };
      }
      dailyData[date].expenses += expense.total_amount;
    });

    // Calculate daily profits
    return Object.values(dailyData).map(day => ({
      ...day,
      profit: day.revenue - day.expenses,
      profitMargin: ((day.revenue - day.expenses) / (day.revenue || 1) * 100)
    }));
  };

  const calculateSummary = (transactions, expenses) => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.final_amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.total_amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / (totalRevenue || 1)) * 100;
    const averageOrderValue = totalRevenue / (transactions.length || 1);

    // Calculate top expense category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.suppliers?.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.total_amount;
      return acc;
    }, {});

    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    setSummary({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      averageOrderValue,
      topExpenseCategory
    });
  };

  const handleDownload = async (format) => {
    const reportTitle = 'Financial Summary Report';
    const dateRange = { start: startDate, end: endDate };

    const formattedData = financialData.map(day => ({
      'Date': day.date,
      'Revenue': formatCurrency(day.revenue),
      'Expenses': formatCurrency(day.expenses),
      'Net Profit': formatCurrency(day.profit),
      'Profit Margin': `${day.profitMargin.toFixed(2)}%`,
      'Transactions': day.transactions
    }));

    switch (format) {
      case 'pdf':
        const doc = generatePDF(formattedData, reportTitle, dateRange);
        doc.save('financial-summary.pdf');
        break;
      case 'excel':
        const wb = generateExcel(formattedData, reportTitle);
        XLSX.writeFile(wb, 'financial-summary.xlsx');
        break;
      case 'csv':
        const csv = generateCSV(formattedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-summary.csv';
        a.click();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Financial Summary"
        subtitle="Track revenue, expenses, and profitability"
        color="emerald"
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
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-lg font-semibold text-emerald-900">Total Revenue</h4>
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {formatCurrency(summary.totalRevenue)}
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                Average order: {formatCurrency(summary.averageOrderValue)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Wallet className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-red-900">Total Expenses</h4>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(summary.totalExpenses)}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Top category: {summary.topExpenseCategory}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Net Profit</h4>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(summary.netProfit)}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Margin: {summary.profitMargin.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Financial Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Revenue</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Expenses</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Net Profit</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Margin</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
                        <span>Loading financial data...</span>
                      </div>
                    </td>
                  </tr>
                ) : financialData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No financial data available for the selected period
                    </td>
                  </tr>
                ) : (
                  financialData.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {day.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-600 text-right font-medium">
                        {formatCurrency(day.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 text-right font-medium">
                        {formatCurrency(day.expenses)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-right">
                        <span className={day.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {formatCurrency(day.profit)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {day.profitMargin >= 0 ? (
                            <ArrowUp className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`font-medium ${
                            day.profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {Math.abs(day.profitMargin).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {day.transactions}
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

export default FinancialSummary;