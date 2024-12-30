import React from 'react';
import { X, Printer } from 'lucide-react';

const ReceiptModal = ({ transaction, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Receipt
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Receipt Header */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-900">Jazz Coffee</h4>
            <p className="text-gray-500">Order #{transaction.order.order_number}</p>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleString()}
            </p>
          </div>

          {/* Order Items */}
          <div className="border-t border-b py-4">
            {transaction.order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <div>
                  <p className="text-gray-900">{item.products.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x ${item.unit_price}
                  </p>
                </div>
                <p className="text-gray-900">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${transaction.order.total_amount.toFixed(2)}</span>
            </div>

            {transaction.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>
                  Discount
                  {transaction.discountType === 'promo' && transaction.promotion && (
                    <span className="text-sm text-gray-500">
                      {' '}
                      ({transaction.promotion.name})
                    </span>
                  )}
                </span>
                <span>-${transaction.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>${transaction.finalAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Cash</span>
              <span>${transaction.amountTendered.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Change</span>
              <span>${transaction.change.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;