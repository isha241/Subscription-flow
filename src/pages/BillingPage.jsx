import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, ClockIcon, ArrowLeftIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useSubscription } from '../context/SubscriptionContext';

// Card Preview Component
function CardPreview({ cardNumber, expiryDate }) {
  const [showCardNumber, setShowCardNumber] = useState(false);
  
  const formatCardNumber = (number) => {
    if (!number) return '•••• •••• •••• ••••';
    if (!showCardNumber) {
      return '•••• •••• •••• ' + number.slice(-4);
    }
    const cleaned = number.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19) || '•••• •••• •••• ••••';
  };

  const formatExpiryDate = (date) => {
    if (!date) return 'MM/YY';
    return date;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="mb-4">
        <div className="text-gray-600 text-sm mb-1">Current Card</div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-gray-600 text-sm">Card Number</div>
            <button
              type="button"
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showCardNumber ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="text-gray-900 font-mono">{formatCardNumber(cardNumber)}</div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-gray-600 text-sm mb-1">Expires</div>
            <div className="text-gray-900">{formatExpiryDate(expiryDate)}</div>
          </div>
          <div className="text-gray-900">VISA</div>
        </div>
      </div>
    </div>
  );
}

// Update Payment Modal Component
function UpdatePaymentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVC, setShowCVC] = useState(false);

  const CREDIT_CARD_REGEX = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/;
  const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  const CVC_REGEX = /^[0-9]{3,4}$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'cardNumber':
        const cleanCardNumber = value.replace(/[\s-]/g, '');
        if (!CREDIT_CARD_REGEX.test(cleanCardNumber)) {
          return 'Please enter a valid credit card number';
        }
        break;
      case 'expiryDate':
        if (!EXPIRY_DATE_REGEX.test(value)) {
          return 'Please enter a valid expiry date (MM/YY)';
        }
        const [month, year] = value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiry < new Date()) {
          return 'Card has expired';
        }
        break;
      case 'cvc':
        if (!CVC_REGEX.test(value)) {
          return 'Please enter a valid CVC (3-4 digits)';
        }
        break;
    }
    return '';
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    }
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setShowCVC(true);
    } else {
      setShowCVC(false);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    const error = validateField(name, formattedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Here you would typically make an API call to update the payment method
    // For now, we'll just close the modal
    onClose();
  };

  if (!isOpen) return null;

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500";
  const errorClasses = "text-sm text-red-600 mt-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Update Payment Method
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="mb-6">
          <CardPreview
            cardNumber="4232 3232 3223 4444"
            expiryDate="04/34"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              New Card Number
            </label>
            <div className="relative">
              <input
                type={showCardNumber ? "text" : "password"}
                name="cardNumber"
                id="cardNumber"
                required
                value={formData.cardNumber}
                onChange={handleChange}
                className={inputClasses}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              <button
                type="button"
                onClick={() => setShowCardNumber(!showCardNumber)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCardNumber ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.cardNumber && <p className={errorClasses}>{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                id="expiryDate"
                required
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleChange}
                className={inputClasses}
                maxLength="5"
              />
              {errors.expiryDate && <p className={errorClasses}>{errors.expiryDate}</p>}
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <div className="relative">
                <input
                  type={showCVC ? "text" : "password"}
                  name="cvc"
                  id="cvc"
                  required
                  value={formData.cvc}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="123"
                  maxLength="4"
                />
                <button
                  type="button"
                  onClick={() => setShowCVC(!showCVC)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCVC ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.cvc && <p className={errorClasses}>{errors.cvc}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Update Payment Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const navigate = useNavigate();
  const { activePlan, hasActiveSubscription } = useSubscription();
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);

  // Mock billing history
  const billingHistory = [
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      amount: activePlan?.price || 0,
      status: 'Paid',
    },
    {
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      amount: activePlan?.price || 0,
      status: 'Paid',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{activePlan?.name} Plan</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${activePlan?.price.toFixed(2)}/month
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Plan
              </button>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Credit Card</div>
                    <div className="text-gray-500">Ending in •••• 4242</div>
                    <div className="text-gray-500">Expires 12/25</div>
                  </div>
                  <CreditCardIcon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => setShowUpdatePaymentModal(true)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update Payment Method
              </button>
            </div>
          </motion.div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 md:col-span-2"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left text-gray-500">Amount</th>
                    <th className="px-4 py-2 text-left text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-2 text-gray-900">{item.date}</td>
                      <td className="px-4 py-2 text-gray-900">${item.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Update Payment Modal */}
        <UpdatePaymentModal
          isOpen={showUpdatePaymentModal}
          onClose={() => setShowUpdatePaymentModal(false)}
        />
      </div>
    </div>
  );
} 