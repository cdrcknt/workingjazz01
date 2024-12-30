import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Calendar, Tag, Percent, Archive, Edit2, Trash2, Search } from 'lucide-react';

const ActivePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (promotion) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update(promotion)
        .eq('id', promotion.id);

      if (error) throw error;
      setEditingPromotion(null);
      fetchPromotions();
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Are you sure you want to archive this promotion?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_archived: true, is_active: false })
        .eq('id', id);

      if (error) throw error;
      fetchPromotions();
    } catch (error) {
      console.error('Error archiving promotion:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const filteredPromotions = promotions.filter(promotion =>
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Active Promotions</h3>
        <p className="text-green-600">Manage ongoing promotional campaigns</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading promotions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPromotions.map((promotion) => (
              <div
                key={promotion.id}
                className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                {editingPromotion?.id === promotion.id ? (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingPromotion.name}
                        onChange={(e) => setEditingPromotion({
                          ...editingPromotion,
                          name: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Promotion Name"
                      />
                      <input
                        type="text"
                        value={editingPromotion.description}
                        onChange={(e) => setEditingPromotion({
                          ...editingPromotion,
                          description: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Description"
                      />
                      <input
                        type="number"
                        value={editingPromotion.discount_value}
                        onChange={(e) => setEditingPromotion({
                          ...editingPromotion,
                          discount_value: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Discount Value"
                      />
                      <input
                        type="datetime-local"
                        value={editingPromotion.end_date.slice(0, 16)}
                        onChange={(e) => setEditingPromotion({
                          ...editingPromotion,
                          end_date: e.target.value
                        })}
                        className="p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingPromotion(null)}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(editingPromotion)}
                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Tag className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{promotion.name}</h4>
                            <p className="text-sm text-gray-600">{promotion.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            Until {new Date(promotion.end_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-green-600 font-medium">
                            <Percent className="w-4 h-4 mr-1" />
                            {promotion.discount_value}
                            {promotion.discount_type === 'percentage' ? '%' : ' PHP'} OFF
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingPromotion(promotion)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleArchive(promotion.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredPromotions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No active promotions found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePromotions;