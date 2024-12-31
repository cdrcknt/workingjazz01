import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Coffee, Plus, Minus, Trash2 } from 'lucide-react';

const CustomerOrderEntry = () => {
  const [products, setProducts] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProducts();
    fetchCustomizations();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomizations = async () => {
    try {
      const { data, error } = await supabase
        .from('customizations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCustomizations(data || []);
    } catch (error) {
      console.error('Error fetching customizations:', error);
    }
  };

  const addItem = (product) => {
    setSelectedItems(prev => [
      ...prev,
      {
        id: Date.now(),
        product_id: product.id,
        product: product,
        quantity: 1,
        unit_price: product.price,
        customizations: [],
        notes: ''
      }
    ]);
  };

  const updateItemQuantity = (itemId, increment) => {
    setSelectedItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + increment);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const toggleCustomization = (itemId, customization) => {
    setSelectedItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const hasCustomization = item.customizations.some(c => c.id === customization.id);
          const newCustomizations = hasCustomization
            ? item.customizations.filter(c => c.id !== customization.id)
            : [...item.customizations, { ...customization, quantity: 1 }];
          return { ...item, customizations: newCustomizations };
        }
        return item;
      })
    );
  };

  const updateItemNotes = (itemId, notes) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, notes } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const itemTotal = item.unit_price * item.quantity;
      const customizationsTotal = item.customizations.reduce((sum, custom) =>
        sum + (custom.price * custom.quantity), 0);
      return total + itemTotal + customizationsTotal;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      setMessage({ type: 'error', text: 'Please add items to the order' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: userData } = await supabase.auth.getUser();
      const orderNumber = `ORD${Date.now().toString().slice(-6)}`;
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          total_amount: calculateTotal(),
          total_items: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
          status: 'pending',
          created_by: userData.user.id
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items and their customizations
      const orderItemPromises = selectedItems.map(async (item) => {
        const { data: orderItemData, error: itemError } = await supabase
          .from('order_items')
          .insert([{
            order_id: orderData.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.unit_price * item.quantity,
            notes: item.notes
          }])
          .select()
          .single();

        if (itemError) throw itemError;

        if (item.customizations.length > 0) {
          const customizationPromises = item.customizations.map(custom =>
            supabase
              .from('order_item_customizations')
              .insert([{
                order_item_id: orderItemData.id,
                customization_id: custom.id,
                quantity: custom.quantity,
                price: custom.price
              }])
          );

          await Promise.all(customizationPromises);
        }
      });

      await Promise.all(orderItemPromises);

      // Create initial status history
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert([{
          order_id: orderData.id,
          new_status: 'pending',
          changed_by: userData.user.id
        }]);

      if (historyError) throw historyError;

      setMessage({ type: 'success', text: `Order #${orderNumber} created successfully` });
      setSelectedItems([]);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-orange-800 mb-2">Customer Order Entry</h3>
        <p className="text-orange-600">Create and manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Items</h4>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addItem(product)}
                    className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Coffee className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <h5 className="font-medium text-gray-900">{product.name}</h5>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
            
            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items added yet</p>
            ) : (
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-right text-gray-600">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Customizations */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Customizations:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {customizations.map((custom) => (
                          <button
                            key={custom.id}
                            onClick={() => toggleCustomization(item.id, custom)}
                            className={`p-2 text-sm rounded-lg transition-colors ${
                              item.customizations.some(c => c.id === custom.id)
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {custom.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateItemNotes(item.id, e.target.value)}
                      placeholder="Add notes..."
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-700">Total Amount:</span>
                    <span className="text-xl font-semibold text-gray-900">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading || selectedItems.length === 0}
                    className={`w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-medium
                      hover:bg-orange-700 focus:ring-4 focus:ring-orange-500/20 transition-colors
                      ${(loading || selectedItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>

                  {message.text && (
                    <div className={`mt-4 p-4 rounded-lg text-sm ${
                      message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {message.text}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderEntry;