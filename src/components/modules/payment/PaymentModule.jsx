import React, { useState, useEffect } from 'react';
import { DollarSign, Receipt, FileText, BarChart2 } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import PaymentProcessing from './components/PaymentProcessing';
import TransactionHistory from './components/TransactionHistory';
import Reconciliation from './components/Reconciliation';

const PaymentModule = () => {
  const [activeTab, setActiveTab] = useState('payment');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Management</h3>
        <p className="text-green-600">Process payments and manage transactions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('payment')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'payment'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Payment Processing</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'history'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Transaction History</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'reconciliation'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5" />
              <span>Financial Reconciliation</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'payment' && <PaymentProcessing />}
          {activeTab === 'history' && <TransactionHistory />}
          {activeTab === 'reconciliation' && <Reconciliation />}
        </div>
      </div>
    </div>
  );
};

export default PaymentModule;