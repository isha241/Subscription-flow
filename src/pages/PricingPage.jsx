import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Basic',
    price: 9.99,
    features: [
      'Basic subscription management',
      'Email support',
      'Basic analytics',
      'Up to 2 team members',
    ],
    description: 'Perfect for individuals and small projects',
  },
  {
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
    description: 'Best for growing businesses',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: [
      'Enterprise-grade subscription management',
      '24/7 phone & chat support',
      'Advanced analytics & reporting',
      'Unlimited team members',
      'Custom branding & integrations',
      'Dedicated account manager',
      'Custom API solutions',
    ],
    description: 'For large organizations',
  },
];

const faqs = [
  {
    question: "What's included in the free trial?",
    answer: "Your 14-day free trial includes all features of your selected plan. You can explore the full capabilities of our platform with no limitations during the trial period."
  },
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes to your subscription will be reflected in your next billing cycle."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans."
  },
  {
    question: "Is there a long-term contract?",
    answer: "No, all our plans are month-to-month with no long-term commitment required. You can cancel anytime."
  }
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 text-xl text-gray-500 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-16 space-y-4 sm:mt-24 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-5xl lg:mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl shadow-xl overflow-hidden ${
                plan.popular 
                  ? 'border-2 border-indigo-500 bg-white transform scale-105 z-10' 
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 bg-indigo-500">
                  <p className="text-xs font-medium text-white text-center py-1">
                    Most Popular
                  </p>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 mb-6">{plan.description}</p>
                <p className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/signup', { state: { plan } })}
                  className={`mt-8 w-full rounded-lg py-3 px-4 text-sm font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Start free trial
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 