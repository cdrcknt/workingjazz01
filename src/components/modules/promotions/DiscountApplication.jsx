import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Tag, User, Percent, Search } from 'lucide-react';

const DiscountApplication = () => {
  const [discountTypes, setDiscountTypes] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState({
    id_number: '',
    customer_name: ''
  });

  useEffect(() => {
    fetchDiscountTypes();
    fetchActivePromotions();
  }, []);

  const fetchDiscountTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_types')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setDiscountTypes(data || []);
    } catch (error) {
      console.error('Error fetching discount types:', error);
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
      setActivePromotions(data || []);
    } catch (error) {
      console.error('Error fetching active promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    // Handle verification logic here
    console.log('Verification details:', verificationDetails);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Discount Application</h3>
        <p className="text-blue-600">Apply automatic and manual discounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Discounts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Manual Discounts</h4>
          
          <div className="space-y-4">
            {discountTypes.map((discount) => (
              <button
                key={discount.id}
                onClick={() => setSelectedDiscount(discount)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  selectedDiscount?.id === discount.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">{discount.name}</h5>
                    <p className="text-sm text-gray-500">{discount.description}</p>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">
                  {discount.discount_value}%
                </span>
              </button>
            ))}
          </div>

          {selectedDiscount && (
            <form onSubmit={handleVerification} className="mt-6 space-y-4">
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
                    value={verificationDetails.customer_name}
                    onChange={(e) => setVerificationDetails({
                      ...verificationDetails,
                      customer_name: e.target.value
                    })}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={verificationDetails.id_number}
                    onChange={(e) => setVerificationDetails({
                      ...verificationDetails,
                      id_number: e.target.value
                    })}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Discount
              </button>
            </form>
          )}
        </div>

        {/* Automatic Discounts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Automatic Discounts</h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading promotions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePromotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{promotion.name}</h5>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{promotion.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Valid until: {new Date(promotion.end_date).toLocaleDateString()}</span>
                    <span className="font-medium text-blue-600">
                      {promotion.discount_value}
                      {promotion.discount_type === 'percentage' ? '%' : ' PHP'} OFF
                    </span>
                  </div>
                </div>
              ))}

              {activePromotions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No active automatic discounts
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountApplication;