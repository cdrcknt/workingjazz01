import React, { useState, useEffect } from 'react';
import { Package, Tag, DollarSign, List } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import { createRecord } from '../../../utils/databaseHelpers';

const PRODUCT_CATEGORIES = [
  'Coffee',
  'Milktea',
  'Frappe',
  'Non-Coffee Alternatives',
  'Signature Drinks',
  'Fruit Tea',
  'Pasta',
  'Pastries'
];

const ProductRegistration = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    price: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please sign in to register products' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await createRecord('products', {
        ...formData,
        price: parseFloat(formData.price),
        user_id: currentUser.id
      });

      setMessage({
        type: 'success',
        text: 'Product registered successfully!'
      });
      setFormData({
        product_id: '',
        name: '',
        price: '',
        category: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-amber-800 mb-2">Product Registration</h3>
        <p className="text-amber-600">Add new products to the inventory</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (PHP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <List className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {PRODUCT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-amber-600 text-white rounded-lg font-medium
                hover:bg-amber-700 focus:ring-4 focus:ring-amber-500/20 transition-colors
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Register Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistration;