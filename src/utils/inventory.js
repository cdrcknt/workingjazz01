import { supabase } from './supabaseClient';

export const fetchProducts = async (searchTerm, selectedCategory) => {
  try {
    let query = supabase
      .from('products')
      .select('*, stock_levels(current_stock, threshold_level, last_updated)');

    if (searchTerm) {
      query = query.or(`product_id.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
    }

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateStock = async (product, updateType, amount) => {
  try {
    const currentStock = product.stock_levels?.current_stock || 0;
    const newStock = updateType === 'add' 
      ? currentStock + parseInt(amount)
      : Math.max(0, currentStock - parseInt(amount));

    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    // Update stock levels
    const { data: updatedStock, error: stockError } = await supabase
      .from('stock_levels')
      .upsert({
        product_id: product.id,
        current_stock: newStock,
        threshold_level: product.stock_levels?.threshold_level || 10,
        last_updated: new Date().toISOString()
      })
      .select();

    if (stockError) throw stockError;

    // Record the stock movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        product_id: product.id,
        movement_type: updateType,
        quantity: parseInt(amount),
        previous_stock: currentStock,
        new_stock: newStock,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (movementError) throw movementError;

    return updatedStock[0] || newStock;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};
