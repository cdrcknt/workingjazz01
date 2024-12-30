import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import { DollarSign, Calculator, Receipt, AlertCircle } from 'lucide-react';
import DenominationInput from '../DenominationInput';
import ReceiptModal from './ReceiptModal';

const PaymentProcessing = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activePromos, setActivePromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [manualDiscount, setManualDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('none');
  const [amountTendered, setAmountTendered] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingOrders();
    fetchActivePromotions();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, price)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchActivePromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString());

      if (error) throw error;
      setActivePromos(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const calculateDiscount = () => {
    if (!selectedOrder) return 0;
    
    if (discountType === 'manual') {
      return manualDiscount;
    } else if (discountType === 'promo' && selectedPromo) {
      const amount = selectedOrder.total_amount;
      return selectedPromo.discount_type === 'percentage'
        ? (amount * selectedPromo.discount_value) / 100
        : selectedPromo.discount_value;
    }
    
    return 0;
  };

  const calculateTotal = () => {
    if (!selectedOrder) return 0;
    const discount = calculateDiscount();
    return Math.max(0, selectedOrder.total_amount - discount);
  };

  const calculateChange = () => {
    return Math.max(0, amountTendered - calculateTotal());
  };

  const handlePayment = async () => {
    if (!selectedOrder) return;
    
    setLoading(true);
    setError('');

    try {
      const finalAmount = calculateTotal();
      const changeAmount = calculateChange();

      if (amountTendered < finalAmount) {
        throw new Error('Insufficient amount tendered');
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          order_id: selectedOrder.id,
          total_amount: selectedOrder.total_amount,
          discount_amount: calculateDiscount(),
          discount_type: discountType,
          promotion_id: selectedPromo?.id,
          final_amount: finalAmount,
          amount_tendered: amountTendered,
          change_amount: changeAmount,
          payment_status: 'completed',
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', selectedOrder.id);

      if (orderError) throw orderError;

      setShowReceipt(true);
      resetForm();
      fetchPendingOrders();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOrder(null);
    setSelectedPromo(null);
    setManualDiscount(0);
    setDiscountType('none');
    setAmountTendered(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Selection */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Order</h4>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  selectedOrder?.id === order.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Order #{order.order_number}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.order_items.length} items
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </button>
            ))}

            {pendingOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending orders
              </div>
            )}
          </div>
        </div>

        {/* Discount Selection */}
        {selectedOrder && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Apply Discount
            </h4>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setDiscountType('none')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    discountType === 'none'
                      ? 'bg-white border-green-500 text-green-600'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  No Discount
                </button>
                <button
                  onClick={() => setDiscountType('manual')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    discountType === 'manual'
                      ? 'bg-white border-green-500 text-green-600'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setDiscountType('promo')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    discountType === 'promo'
                      ? 'bg-white border-green-500 text-green-600'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Promotion
                </button>
              </div>

              {discountType === 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={manualDiscount}
                      onChange={(e) => setManualDiscount(parseFloat(e.target.value) || 0)}
                      className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {discountType === 'promo' && (
                <div className="space-y-4">
                  {activePromos.map((promo) => (
                    <button
                      key={promo.id}
                      onClick={() => setSelectedPromo(promo)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        selectedPromo?.id === promo.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{promo.name}</p>
                          <p className="text-sm text-gray-500">{promo.description}</p>
                        </div>
                        <p className="font-medium text-green-600">
                          {promo.discount_type === 'percentage'
                            ? `${promo.discount_value}%`
                            : `$${promo.discount_value}`}
                        </p>
                      </div>
                    </button>
                  ))}

                  {activePromos.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No active promotions
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Processing */}
      <div>
        {selectedOrder ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Details
            </h4>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-gray-900 pt-3 border-t">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Cash Input */}
              <DenominationInput
                onTotalChange={setAmountTendered}
                minimumAmount={calculateTotal()}
              />

              {/* Change Calculation */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Tendered:</span>
                  <span className="font-medium text-gray-900">
                    ${amountTendered.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Change:</span>
                  <span className="font-medium text-gray-900">
                    ${calculateChange().toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handlePayment}
                  disabled={loading || amountTendered < calculateTotal()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    loading || amountTendered < calculateTotal()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Order Selected
            </h4>
            <p className="text-gray-500">
              Please select an order from the list to process payment
            </p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          transaction={{
            order: selectedOrder,
            discount: calculateDiscount(),
            finalAmount: calculateTotal(),
            amountTendered,
            change: calculateChange(),
            discountType,
            promotion: selectedPromo
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default PaymentProcessing;