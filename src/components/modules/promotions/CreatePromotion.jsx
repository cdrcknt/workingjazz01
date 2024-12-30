import React, { useState } from 'react';
import { Calendar, Tag, Percent, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';

const CreatePromotion = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promotion_type: 'time_based',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    criteria: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('promotions')
        .insert([{
          ...formData,
          created_by: userData.user.id,
          criteria: JSON.stringify(formData.criteria)
        }]);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Promotion created successfully!'
      });
      setFormData({
        name: '',
        description: '',
        promotion_type: 'time_based',
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        criteria: {}
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
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-purple-800 mb-2">Create Promotion</h3>
        <p className="text-purple-600">Set up new promotional offers and discounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.promotion_type}
                  onChange={(e) => setFormData({ ...formData, promotion_type: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                >
                  <option value="time_based">Time-based Promotion</option>
                  <option value="product_specific">Product-specific Promotion</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed_amount">Fixed Amount</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                  min="0"
                  step={formData.discount_type === 'percentage' ? '0.01' : '1'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {message.text}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-purple-600 text-white rounded-lg font-medium
                hover:bg-purple-700 focus:ring-4 focus:ring-purple-500/20 transition-colors
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Promotion...' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromotion;