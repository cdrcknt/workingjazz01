import React, { useState, useEffect } from 'react';
import { Clock, Users, Star, TrendingUp } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import DateRangePicker from './components/DateRangePicker';
import ReportActions from './components/ReportActions';
import ReportHeader from './components/ReportHeader';
import { formatCurrency } from '../../../utils/reports/reportHelpers';
import { generatePDF, generateExcel, generateCSV } from '../../../utils/reports/reportGenerator';

const ServiceReport = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({
    totalServices: 0,
    averageServiceTime: 0,
    customerSatisfaction: 0,
    peakHours: ''
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name)
          )
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Process service metrics
      const processedData = processServiceData(data);
      setServiceData(processedData);
      calculateSummary(processedData);
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processServiceData = (data) => {
    return data.map(order => {
      const preparationTime = Math.floor(Math.random() * 20) + 5; // Simulated preparation time
      const satisfaction = Math.floor(Math.random() * 2) + 4; // Simulated satisfaction score
      
      return {
        orderId: order.order_number,
        date: new Date(order.created_at),
        items: order.order_items.length,
        preparationTime,
        satisfaction,
        status: order.status
      };
    });
  };

  const calculateSummary = (data) => {
    const totalServices = data.length;
    const averageServiceTime = data.reduce((sum, item) => sum + item.preparationTime, 0) / totalServices;
    const customerSatisfaction = data.reduce((sum, item) => sum + item.satisfaction, 0) / totalServices;
    
    // Calculate peak hours
    const hourCounts = data.reduce((acc, item) => {
      const hour = item.date.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const peakHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 0;
    
    const peakHourFormatted = `${peakHour}:00 - ${(parseInt(peakHour) + 1).toString().padStart(2, '0')}:00`;

    setSummary({
      totalServices,
      averageServiceTime,
      customerSatisfaction,
      peakHours: peakHourFormatted
    });
  };

  const handleDownload = async (format) => {
    const reportTitle = 'Service Performance Report';
    const dateRange = { start: startDate, end: endDate };

    const formattedData = serviceData.map(service => ({
      'Order ID': service.orderId,
      'Date': service.date.toLocaleDateString(),
      'Items': service.items,
      'Preparation Time (min)': service.preparationTime,
      'Satisfaction': '⭐'.repeat(service.satisfaction),
      'Status': service.status
    }));

    switch (format) {
      case 'pdf':
        const doc = generatePDF(formattedData, reportTitle, dateRange);
        doc.save('service-report.pdf');
        break;
      case 'excel':
        const wb = generateExcel(formattedData, reportTitle);
        XLSX.writeFile(wb, 'service-report.xlsx');
        break;
      case 'csv':
        const csv = generateCSV(formattedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'service-report.csv';
        a.click();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Service Performance Report"
        subtitle="Monitor service quality and efficiency"
        color="purple"
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
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-purple-900">Total Services</h4>
              </div>
              <p className="text-2xl font-bold text-purple-900">{summary.totalServices}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Avg. Service Time</h4>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {summary.averageServiceTime.toFixed(1)} min
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-amber-900">Satisfaction</h4>
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {summary.customerSatisfaction.toFixed(1)} ⭐
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-900">Peak Hours</h4>
              </div>
              <p className="text-2xl font-bold text-green-900">{summary.peakHours}</p>
            </div>
          </div>

          {/* Service Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Items</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Prep Time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Satisfaction</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                        <span>Loading service data...</span>
                      </div>
                    </td>
                  </tr>
                ) : serviceData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No service data available for the selected period
                    </td>
                  </tr>
                ) : (
                  serviceData.map((service, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
  <boltAction type="file" filePath="src/components/modules/reports/ServiceReport.jsx">
    {service.orderId}
  </boltAction>
</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {service.date.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">
                        {service.items}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">
                        {service.preparationTime} min
                      </td>
                      <td className="px-4 py-3 text-sm text-amber-500 text-center">
                        {'⭐'.repeat(service.satisfaction)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.status === 'completed' ? 'bg-green-100 text-green-800' :
                          service.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
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

export default ServiceReport;