import React, { useState, useEffect } from 'react';
import { User, Clock, Activity, Filter } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import DateRangePicker from './components/DateRangePicker';
import ReportActions from './components/ReportActions';
import ReportHeader from './components/ReportHeader';
import { fetchUserLogs } from '../../../utils/reports/reportQueries';
import { generatePDF, generateExcel, generateCSV } from '../../../utils/reports/reportGenerator';

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [summary, setSummary] = useState({
    totalActions: 0,
    uniqueUsers: 0,
    mostActiveModule: '',
    peakHour: ''
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, filterModule]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserLogs(startDate, endDate);
      const filteredData = filterModule === 'all' 
        ? data 
        : data.filter(log => log.module === filterModule);
      
      setLogs(filteredData);
      calculateSummary(filteredData);
    } catch (error) {
      console.error('Error fetching user logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalActions = data.length;
    const uniqueUsers = new Set(data.map(log => log.user_id)).size;
    
    const moduleCounts = data.reduce((acc, log) => {
      acc[log.module] = (acc[log.module] || 0) + 1;
      return acc;
    }, {});
    
    const mostActiveModule = Object.entries(moduleCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    const hourCounts = data.reduce((acc, log) => {
      const hour = new Date(log.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const peakHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 0;

    setSummary({
      totalActions,
      uniqueUsers,
      mostActiveModule,
      peakHour: `${peakHour}:00 - ${(parseInt(peakHour) + 1).toString().padStart(2, '0')}:00`
    });
  };

  const handleDownload = async (format) => {
    const reportTitle = 'User Activity Logs';
    const dateRange = { start: startDate, end: endDate };

    const formattedData = logs.map(log => ({
      'User': log.users?.email || 'Unknown',
      'Action': log.action,
      'Module': log.module,
      'Date & Time': new Date(log.created_at).toLocaleString(),
      'IP Address': log.ip_address
    }));

    switch (format) {
      case 'pdf':
        const doc = generatePDF(formattedData, reportTitle, dateRange);
        doc.save('user-logs.pdf');
        break;
      case 'excel':
        const wb = generateExcel(formattedData, reportTitle);
        XLSX.writeFile(wb, 'user-logs.xlsx');
        break;
      case 'csv':
        const csv = generateCSV(formattedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-logs.csv';
        a.click();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="User Activity Logs"
        subtitle="Monitor user actions and system usage"
        color="indigo"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 space-y-4">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">All Modules</option>
                  <option value="inventory">Inventory</option>
                  <option value="sales">Sales</option>
                  <option value="employees">Employees</option>
                  <option value="reports">Reports</option>
                </select>
              </div>
            </div>
            <ReportActions onDownload={handleDownload} isLoading={loading} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-indigo-900">Total Actions</h4>
              </div>
              <p className="text-2xl font-bold text-indigo-900">{summary.totalActions}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Unique Users</h4>
              </div>
              <p className="text-2xl font-bold text-blue-900">{summary.uniqueUsers}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-purple-900">Most Active Module</h4>
              </div>
              <p className="text-2xl font-bold text-purple-900">{summary.mostActiveModule}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-900">Peak Activity</h4>
              </div>
              <p className="text-2xl font-bold text-green-900">{summary.peakHour}</p>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Module</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                        <span>Loading user logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No logs available for the selected period
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {log.users?.email || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                          {log.module}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.ip_address}</td>
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

export default UserLogs;