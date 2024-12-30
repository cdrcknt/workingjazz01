import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
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
    profitMargin: 0
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (transactionError) throw transactionError;

      // Fetch expenses (supplier orders, etc.)
      const { data: expenses, error: expenseError } = await supabase
        .from('supplier_orders')
        .select('total_amount')
        .gte('order_date', startDate)
        .lte('order_date', endDate);

      if (expenseError) throw expenseError;

      const processedData = processFinancialData(transactions, expenses);
      setFinancialData(processedData);
      calculateSummary(processedData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processFinancialData = (transactions, expenses) => {
    // Group transactions by date
    const dailyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          revenue: 0,
          expenses: 0,
          transactions: 0
        };
      }
      acc[date].revenue += transaction.final_amount;
      acc[date].transactions += 1;
      return acc;
    }, {});

    // Add expenses
    expenses.forEach(expense => {
      const date = new Date(expense.order_date).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          expenses: 0,
          transactions: 0
        };
      }
      dailyData[date].expenses += expense.total_amount;
    });

    return Object.values(dailyData).map(day => ({
      ...day,
      profit: day.revenue - day.expenses,
      margin: ((day.revenue - day.expenses) / day.revenue * 100) || 0
    }));
  };

  const calculateSummary = (data) => {
    const totalRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
    const totalExpenses = data.reduce((sum, day) => sum + day.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / totalRevenue * 100) || 0;

    setSummary({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin
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
      'Profit Margin': day.margin.toFixed(2) + '%',
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