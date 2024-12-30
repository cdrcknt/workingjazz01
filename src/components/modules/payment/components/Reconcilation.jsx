import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import { DollarSign, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Reconciliation = () => {
  const [transactions, setTransactions] = useState([]);
  const [actualAmount, setActualAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTodayTransactions();
  }, []);

  const fetchTodayTransactions = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('payment_status', 'completed')
        .gte('created_at', today.toISOString());

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateExpectedAmount = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.final_amount, 0);
  };

  const calculateDiscrepancy = () => {
    return actualAmount - calculateExpectedAmount();
  };

  const handleReconciliation = async () => {
    setReconciling(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('daily_reconciliations')
        .insert([{
          reconciliation_date: new Date().toISOString(),
          expected_amount: calculateExpectedAmount(),
          actual_amount: actualAmount,
          discrepancy_amount: calculateDiscrepancy(),
          status: Math.abs(calculateDiscrepancy()) < 0.01 ? 'balanced' : 'discrepancy',
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      setSuccess('Reconciliation completed successfully');
      setActualAmount(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setReconciling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Expected Amount</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${calculateExpectedAmount().toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Based on {transactions.length} transactions today
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Actual Amount</h4>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={actualAmount}
            onChange={(e) => setActualAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-2xl font-bold text-gray-900"
          />
          <p className="text-sm text-gray-500 mt-1">Enter the counted cash amount</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              calculateDiscrepancy() === 0
                ? 'bg-green-100'
                : calculateDiscrepancy() > 0
                ? 'bg-blue-100'
                : 'bg-red-100'
            }`}>
              {calculateDiscrepancy() === 0 ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : calculateDiscrepancy() > 0 ? (
                <DollarSign className="w-6 h-6 text-blue-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Discrepancy</h4>
          </div>
          <p className={`text-2xl font-bold ${
            calculateDiscrepancy() === 0
              ? 'text-green-600'
              : calculateDiscrepancy() > 0
              ? 'text-blue-600'
              : 'text-red-600'
          }`}>
            ${Math.abs(calculateDiscrepancy()).toFixed(2)}
            {calculateDiscrepancy() !== 0 && (
              <span className="text-sm font-normal">
                {calculateDiscrepancy() > 0 ? ' (Over)' : ' (Short)'}
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {calculateDiscrepancy() === 0
              ? 'Perfectly balanced'
              : calculateDiscrepancy() > 0
              ? 'More cash than expected'
              : 'Less cash than expected'}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Transactions
        </h4>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading transactions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Transaction #{transaction.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  ${transaction.final_amount.toFixed(2)}
                </p>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions today
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {
            setActualAmount(0);
            setError('');
            setSuccess('');
          }}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleReconciliation}
          disabled={reconciling || actualAmount === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            reconciling || actualAmount === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {reconciling ? 'Processing...' : 'Complete Reconciliation'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}
    </div>
  );
};

export default Reconciliation;