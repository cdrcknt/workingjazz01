import { supabase } from '../supabaseClient';

export const createOrder = async (orderData, items) => {
  const { orderNumber, total, totalItems } = orderData;
  
  try {
    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        total_amount: total,
        total_items: totalItems,
        status: 'pending',
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product.price,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Create initial status history
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert([{
        order_id: orderData.id,
        new_status: 'pending',
        changed_by: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (historyError) throw historyError;

    return orderData;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus, notes = '') => {
  try {
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateError) throw updateError;

    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert([{
        order_id: orderId,
        previous_status: currentOrder.status,
        new_status: newStatus,
        notes,
        changed_by: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (historyError) throw historyError;
  } catch (error) {
    throw error;
  }
};