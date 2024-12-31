import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Calendar, Package, Search, Clock, ChevronDown, ChevronRight } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, price)
          ),
          order_status_history (
            *
          )
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Order History</h3>
        <p className="text-blue-600">View completed orders and their details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No completed orders found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Order #{order.order_number}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Order Items</h5>
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">{item.quantity}x</span>
                            <span className="text-gray-900">{item.products.name}</span>
                          </div>
                          <span className="text-gray-600">
                            ${(item.quantity * item.unit_price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span className="text-gray-900">Total Amount</span>
                        <span className="text-blue-600">${order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;