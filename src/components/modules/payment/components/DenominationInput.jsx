import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

const DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

const DenominationInput = ({ onTotalChange, minimumAmount }) => {
  const [denominations, setDenominations] = useState({});

  useEffect(() => {
    const total = calculateTotal();
    onTotalChange(total);
  }, [denominations]);

  const calculateTotal = () => {
    return Object.entries(denominations).reduce((sum, [denom, count]) => {
      return sum + (parseInt(denom) * (parseInt(count) || 0));
    }, 0);
  };

  const handleDenominationChange = (denomination, value) => {
    setDenominations(prev => ({
      ...prev,
      [denomination]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-900">Cash Denominations</h5>
        <div className="flex items-center text-green-600">
          <Calculator className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            Total: ${calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DENOMINATIONS.map((denom) => (
          <div key={denom} className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ₱{denom}
              </label>
              <input
                type="number"
                min="0"
                value={denominations[denom] || ''}
                onChange={(e) => handleDenominationChange(denom, e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="font-medium text-gray-900">
                ₱{((denominations[denom] || 0) * denom).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {calculateTotal() < minimumAmount && (
        <p className="text-sm text-red-600">
          Amount is less than the required total (₱{minimumAmount.toFixed(2)})
        </p>
      )}
    </div>
  );
};

export default DenominationInput;