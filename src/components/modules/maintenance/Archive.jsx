import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Archive as ArchiveIcon, Search } from 'lucide-react';

const Archive = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (product) => {
    if (!confirm('Are you sure you want to archive this product?')) return;

    try {
      // First, insert into archived_products
      const { error: archiveError } = await supabase
        .from('archived_products')
        .insert([{
          product_id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          archived_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (archiveError) throw archiveError;

      // Then, delete from products
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) throw deleteError;

      fetchProducts();
    } catch (error) {
      console.error('Error archiving product:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-amber-800 mb-2">Archive Products</h3>
        <p className="text-amber-600">Archive products that are no longer active</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading products...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {product.product_id} • ${product.price} • {product.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleArchive(product)}
                      className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <ArchiveIcon className="w-5 h-5" />
                      <span>Archive</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Archive;