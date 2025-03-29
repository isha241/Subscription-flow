import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [activePlan, setActivePlan] = useState(null);

  const value = {
    activePlan,
    setActivePlan,
    hasActiveSubscription: !!activePlan
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 