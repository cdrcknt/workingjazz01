import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import { Search, Calendar, DollarSign, Receipt } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [dateFilter]);

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          orders (
            order_number,
            order_items (
              quantity,
              unit_price,
              products (name)
            )
          ),
          promotions (name)
        `)
        .eq('payment_status', 'completed');

      // Apply date filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today':
          query = query.gte('created_at', today.toISOString());
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          query = query.gte('created_at', weekAgo.toISOString());
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          query = query.gte('created_at', monthAgo.toISOString());
          break;
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.orders.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalRevenue = () => {
    return filteredTransactions.reduce((sum, transaction) => {
      return sum + transaction.final_amount;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-4 py-2 rounded-lg ${
              dateFilter === 'today'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('week')}
            className={`px-4 py-2 rounded-lg ${
              dateFilter === 'week'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateFilter('month')}
            className={`px-4 py-2 rounded-lg ${
              dateFilter === 'month'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-green-800">Total Revenue</h4>
            <p className="text-green-600">
              {dateFilter === 'today'
                ? 'Today'
                : dateFilter === 'week'
                ? 'This Week'
                : 'This Month'}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-800">
            ${calculateTotalRevenue().toFixed(2)}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading transactions...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-5 h-5 text-green-600" />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Order #{transaction.orders.order_number}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {transaction.discount_amount > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Discount Applied: ${transaction.discount_amount.toFixed(2)}
                      {transaction.promotions && (
                        <span className="text-green-600">
                          {' '}
                          ({transaction.promotions.name})
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900">
                      ${transaction.final_amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => {/* Implement receipt view/print */}}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Receipt className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;