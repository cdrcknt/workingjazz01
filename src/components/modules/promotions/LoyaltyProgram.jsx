import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { User, Star, Gift, Search, Phone, Mail } from 'lucide-react';

const LoyaltyProgram = () => {
  const [customers, setCustomers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState({
    customer_name: '',
    contact_number: '',
    email: ''
  });

  useEffect(() => {
    fetchCustomers();
    fetchRewards();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_loyalty')
        .select('*')
        .order('total_points', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('customer_loyalty')
        .insert([newCustomer]);

      if (error) throw error;
      
      setNewCustomer({
        customer_name: '',
        contact_number: '',
        email: ''
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleRewardRedeem = async (customerId, rewardId) => {
    // Implement reward redemption logic
    console.log('Redeeming reward:', rewardId, 'for customer:', customerId);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_number?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-amber-800 mb-2">Loyalty Program</h3>
        <p className="text-amber-600">Track customer loyalty and manage rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Customer */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Customer</h4>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newCustomer.customer_name}
                    onChange={(e) => setNewCustomer({
                      ...newCustomer,
                      customer_name: e.target.value
                    })}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={newCustomer.contact_number}
                    onChange={(e) => setNewCustomer({
                      ...newCustomer,
                      contact_number: e.target.value
                    })}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({
                      ...newCustomer,
                      email: e.target.value
                    })}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Add Customer
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h4>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-4 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Gift className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{reward.name}</h5>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <p className="text-sm font-medium text-amber-600 mt-1">
                        {reward.points_required} points required
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Customer Loyalty Tracking</h4>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading customers...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Star className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{customer.customer_name}</h5>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            {customer.contact_number && (
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {customer.contact_number}
                              </span>
                            )}
                            {customer.email && (
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {customer.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-amber-600">
                          {customer.total_points} points
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.total_orders} orders
                        </div>
                      </div>
                    </div>

                    {/* Available Rewards */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-medium text-gray-700">Available Rewards</h6>
                        <button
                          onClick={() => handleRewardRedeem(customer.id)}
                          className="px-3 py-1 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          Redeem Reward
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No customers found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;