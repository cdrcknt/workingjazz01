import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Clock, User, Calendar, ArrowRight } from 'lucide-react';

const TimeTracking = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
    if (selectedEmployee) {
      fetchTimeEntries();
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', selectedEmployee)
        .order('clock_in', { ascending: false });

      if (error) throw error;
      setTimeEntries(data || []);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('time_entries')
        .insert([
          {
            employee_id: selectedEmployee,
            clock_in: new Date().toISOString(),
          }
        ]);

      if (error) throw error;
      fetchTimeEntries();
    } catch (error) {
      console.error('Error clocking in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      const latestEntry = timeEntries[0];
      if (!latestEntry || latestEntry.clock_out) return;

      const { error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', latestEntry.id);

      if (error) throw error;
      fetchTimeEntries();
    } catch (error) {
      console.error('Error clocking out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Time Tracking</h3>
        <p className="text-green-600">Monitor employee attendance and work hours</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <>
              <div className="flex gap-4">
                <button
                  onClick={handleClockIn}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Clock className="w-5 h-5 inline mr-2" />
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <Clock className="w-5 h-5 inline mr-2" />
                  Clock Out
                </button>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Time Entries</h4>
                <div className="space-y-3">
                  {timeEntries.map((entry) => (
                    <div key={entry.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(entry.clock_in).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium text-gray-900">
                            {new Date(entry.clock_in).toLocaleTimeString()}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString() : 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;