import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { CheckIcon, CreditCardIcon, UserIcon } from '@heroicons/react/24/outline';

const CREDIT_CARD_REGEX = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/;
const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
const CVC_REGEX = /^[0-9]{3,4}$/;

export default function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActivePlan } = useSubscription();
  const selectedPlan = location.state?.plan || {
    name: 'Pro',
    price: 23.99,
    features: [
      'Advanced subscription management',
      'Priority email & chat support',
      'Detailed analytics',
      'Up to 10 team members',
      'Custom branding',
      'API access',
    ],
  };

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'cardNumber':
        // Remove spaces and dashes for validation
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
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'name':
        if (value.length < 2) {
          return 'Name must be at least 2 characters long';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number while typing
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }
    // Format expiry date while typing
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    }
    // Format CVC to only allow numbers
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
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
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setActivePlan(selectedPlan);
    navigate('/dashboard');
  };

  const inputClasses = "block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors";
  const errorClasses = "text-sm text-red-600 mt-1";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Start your free trial
          </h1>
          <p className="text-xl text-gray-500">
            Try {selectedPlan.name} plan free for 14 days.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3 bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Account Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className={errorClasses}>{errors.name}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <p className={errorClasses}>{errors.cardNumber}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <div className="mt-1">
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
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                        CVC
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cvc"
                          id="cvc"
                          required
                          value={formData.cvc}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvc && <p className={errorClasses}>{errors.cvc}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 px-4 hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Start Free Trial
                </button>
              </div>
            </form>
          </motion.div>

          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 sticky top-8">
              <div className="space-y-6">
                {/* Trial Offer */}
                <div className="bg-white rounded-lg p-4 border-2 border-indigo-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                        <span className="text-xl font-bold text-indigo-600">14</span>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Free Trial</h3>
                      <p className="text-sm text-gray-500">Full access to all features</p>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedPlan.name} Plan
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        ${selectedPlan.price}
                      </span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">After your free trial</p>
                </div>

                {/* Key Benefits */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    What you'll get:
                  </h4>
                  <ul className="space-y-3">
                    {selectedPlan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                        <span className="ml-3 text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Cancel anytime
                    </span>
                    <span className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Secure checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 