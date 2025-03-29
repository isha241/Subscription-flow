import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PricingPage from "./pages/PricingPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import BillingPage from "./pages/BillingPage";
import Footer from "./components/Footer";
import { SubscriptionProvider, useSubscription } from "./context/SubscriptionContext";

function Navigation() {
  const { hasActiveSubscription } = useSubscription();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white hover:text-indigo-100 transition-colors">
              Subscription Service
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {hasActiveSubscription ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-white hover:text-indigo-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/pricing"
                  className="px-4 py-2 text-white hover:text-indigo-100 transition-colors"
                >
                  Plans
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="px-4 py-2 text-white hover:text-indigo-100 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <SubscriptionProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-grow bg-gradient-to-b from-gray-50 to-white"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/pricing" />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/billing" element={<BillingPage />} />
            </Routes>
          </motion.div>
          <Footer />
        </div>
      </SubscriptionProvider>
    </Router>
  );
}