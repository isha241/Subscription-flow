import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

const PricingPlan = ({ plan, isPopular, onSelect }) => {
  // Format price to always show 2 decimal places
  const formattedPrice = Number(plan.price).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 ${
        isPopular ? 'ring-2 ring-blue-600' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-block rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-4xl font-bold text-gray-900">${formattedPrice}</span>
          <span className="ml-1 text-gray-500">/month</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
      </div>

      <ul className="mt-6 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span className="ml-3 text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={`mt-8 w-full rounded-lg px-4 py-2 text-sm font-semibold ${
          isPopular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } transition-colors`}
      >
        Get Started
      </button>
    </motion.div>
  );
};

export default PricingPlan; 