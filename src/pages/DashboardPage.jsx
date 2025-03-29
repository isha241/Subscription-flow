import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CreditCardIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSubscription } from '../context/SubscriptionContext';

// Confirmation Modal Component
function CancelSubscriptionModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Cancel Subscription
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to cancel your subscription? You will:
          </p>
          <ul className="space-y-2 text-gray-600 mb-4">
            <li className="flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
              Lose access to premium features
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
              Your subscription will end at the billing period
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
              Cannot undo this action
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            You can resubscribe at any time to regain access to all features.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activePlan, hasActiveSubscription, setActivePlan } = useSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Redirect to pricing if no active subscription
    if (!hasActiveSubscription) {
      navigate('/pricing');
    }
  }, [hasActiveSubscription, navigate]);

  const handleCancelSubscription = () => {
    setActivePlan(null);
    setShowCancelModal(false);
    navigate('/pricing');
  };

  if (!hasActiveSubscription) {
    return null; // Prevent flash of content while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
              <p className="text-gray-600">Manage your subscription and account settings</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Subscription Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Active Subscription</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{activePlan.name} Plan</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${activePlan.price.toFixed(2)}/month
                </div>
                <div className="text-sm text-gray-500 mt-1">{activePlan.description}</div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Change Plan
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </motion.div>

          {/* Billing Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Billing Information</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Next billing date</div>
                    <div className="text-gray-500">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <CreditCardIcon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => navigate('/billing')}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Billing →
              </button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 md:col-span-2"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-medium text-gray-900">View Documentation</h3>
                <p className="text-sm text-gray-500 mt-1">Learn how to use our platform</p>
              </button>
              <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-medium text-gray-900">Contact Support</h3>
                <p className="text-sm text-gray-500 mt-1">Get help from our team</p>
              </button>
              <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-medium text-gray-900">Account Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Cancel Subscription Modal */}
        <CancelSubscriptionModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelSubscription}
        />
      </div>
    </div>
  );
} 