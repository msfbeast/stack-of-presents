
import React, { createContext, useState, useContext, useEffect } from 'react';

export type BillingCycle = 'Monthly' | 'Yearly';
export type Category = 'Entertainment' | 'Music' | 'Food' | 'Productivity' | 'Shopping' | 'Health & Fitness';

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  amount: number;
  billingCycle: BillingCycle;
  renewalDate: Date;
  isActive: boolean;
  isFreeTrial?: boolean;
  trialEndDate?: Date;
  receiptUrl?: string;
  usageFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely';
  notes?: string;
}

export interface User {
  email: string | null;
  preferredCurrency: string;
  darkMode: boolean;
  reminderDays: number;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
}

export interface SpendingHistory {
  month: string;
  year: number;
  totalSpend: number;
  categories: Record<Category, number>;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  user: User;
  spendingHistory: SpendingHistory[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  calculateTotalMonthlySpend: () => number;
  getUpcomingRenewals: () => Subscription[];
  getSubscriptionsByCategory: () => Record<Category, Subscription[]>;
  getTrialSubscriptions: () => Subscription[];
  addReceiptToSubscription: (id: string, receiptUrl: string) => void;
  recordMonthlySpending: () => void;
  getMonthlySpendingTrend: () => { month: string; amount: number }[];
}

const DEFAULT_USER: User = {
  email: null,
  preferredCurrency: 'USD',
  darkMode: false,
  reminderDays: 3,
  notificationsEnabled: true,
  emailNotifications: false,
};

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    category: 'Entertainment',
    amount: 17.99,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    isActive: true,
  },
  {
    id: '2',
    name: 'Spotify',
    category: 'Music',
    amount: 12.99,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 12)),
    isActive: true,
  },
  {
    id: '3',
    name: 'Amazon Prime',
    category: 'Entertainment',
    amount: 9.99,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    isActive: true,
  },
  {
    id: '4',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    amount: 20.99,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 18)),
    isActive: true,
  },
  {
    id: '5',
    name: 'HelloFresh',
    category: 'Food',
    amount: 79.96,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    isActive: true,
  },
  {
    id: '6',
    name: 'Apple Music',
    category: 'Music',
    amount: 10.99,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    isActive: true,
  },
  {
    id: '7',
    name: 'Amazon Shopping',
    category: 'Shopping',
    amount: 24.38,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 22)),
    isActive: true,
  },
  {
    id: '8',
    name: 'Fitness Gym',
    category: 'Health & Fitness',
    amount: 89.15,
    billingCycle: 'Monthly',
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    isActive: true,
  },
];

// Some mock data for spending history
const MOCK_SPENDING_HISTORY: SpendingHistory[] = [
  {
    month: 'January',
    year: 2025,
    totalSpend: 150.99,
    categories: {
      'Entertainment': 30.99,
      'Music': 20.99,
      'Food': 40.50,
      'Productivity': 20.99,
      'Shopping': 20.99,
      'Health & Fitness': 16.53,
    }
  },
  {
    month: 'February',
    year: 2025,
    totalSpend: 168.45,
    categories: {
      'Entertainment': 39.99,
      'Music': 20.99,
      'Food': 40.50,
      'Productivity': 29.99,
      'Shopping': 20.99,
      'Health & Fitness': 15.99,
    }
  },
  {
    month: 'March',
    year: 2025,
    totalSpend: 175.67,
    categories: {
      'Entertainment': 39.99,
      'Music': 24.99,
      'Food': 40.50,
      'Productivity': 29.99,
      'Shopping': 24.99,
      'Health & Fitness': 15.21,
    }
  },
  {
    month: 'April',
    year: 2025,
    totalSpend: 192.50,
    categories: {
      'Entertainment': 49.99,
      'Music': 24.99,
      'Food': 42.50,
      'Productivity': 29.99,
      'Shopping': 29.99,
      'Health & Fitness': 15.04,
    }
  },
  {
    month: 'May',
    year: 2025,
    totalSpend: 195.38,
    categories: {
      'Entertainment': 49.99,
      'Music': 24.99,
      'Food': 42.50,
      'Productivity': 29.99,
      'Shopping': 33.12,
      'Health & Fitness': 14.79,
    }
  },
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [spendingHistory, setSpendingHistory] = useState<SpendingHistory[]>(MOCK_SPENDING_HISTORY);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSubscriptions = localStorage.getItem('subscriptions');
    const storedUser = localStorage.getItem('user');
    const storedSpendingHistory = localStorage.getItem('spendingHistory');

    if (storedSubscriptions) {
      const parsedSubscriptions = JSON.parse(storedSubscriptions);
      // Convert string dates back to Date objects
      parsedSubscriptions.forEach((sub: any) => {
        sub.renewalDate = new Date(sub.renewalDate);
        if (sub.trialEndDate) {
          sub.trialEndDate = new Date(sub.trialEndDate);
        }
      });
      setSubscriptions(parsedSubscriptions);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedSpendingHistory) {
      setSpendingHistory(JSON.parse(storedSpendingHistory));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('spendingHistory', JSON.stringify(spendingHistory));
  }, [subscriptions, user, spendingHistory]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription = {
      ...subscription,
      id: Math.random().toString(36).substring(2, 11),
    };
    setSubscriptions([...subscriptions, newSubscription]);
  };

  const updateSubscription = (id: string, updatedSubscription: Partial<Subscription>) => {
    setSubscriptions(
      subscriptions.map((subscription) =>
        subscription.id === id ? { ...subscription, ...updatedSubscription } : subscription
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((subscription) => subscription.id !== id));
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser({ ...user, ...updatedUser });
  };

  const calculateTotalMonthlySpend = () => {
    return subscriptions
      .filter((subscription) => subscription.isActive)
      .reduce((total, subscription) => {
        if (subscription.billingCycle === 'Yearly') {
          return total + subscription.amount / 12;
        }
        return total + subscription.amount;
      }, 0);
  };

  const getUpcomingRenewals = () => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    return subscriptions
      .filter((subscription) => subscription.isActive)
      .filter((subscription) => {
        const renewalDate = new Date(subscription.renewalDate);
        return renewalDate >= today && renewalDate <= thirtyDaysLater;
      })
      .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
  };

  const getSubscriptionsByCategory = () => {
    const categories: Record<Category, Subscription[]> = {
      Entertainment: [],
      Music: [],
      Food: [],
      Productivity: [],
      Shopping: [],
      'Health & Fitness': [],
    };

    subscriptions
      .filter((subscription) => subscription.isActive)
      .forEach((subscription) => {
        categories[subscription.category].push(subscription);
      });

    return categories;
  };
  
  // New methods for enhanced features
  const getTrialSubscriptions = () => {
    const today = new Date();
    
    return subscriptions
      .filter(subscription => subscription.isActive && subscription.isFreeTrial)
      .filter(subscription => {
        if (!subscription.trialEndDate) return false;
        return subscription.trialEndDate >= today;
      })
      .sort((a, b) => {
        if (!a.trialEndDate || !b.trialEndDate) return 0;
        return a.trialEndDate.getTime() - b.trialEndDate.getTime();
      });
  };
  
  const addReceiptToSubscription = (id: string, receiptUrl: string) => {
    updateSubscription(id, { receiptUrl });
  };
  
  const recordMonthlySpending = () => {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();
    
    // Calculate spending by category
    const categories: Record<Category, number> = {
      Entertainment: 0,
      Music: 0,
      Food: 0,
      Productivity: 0,
      Shopping: 0,
      'Health & Fitness': 0,
    };
    
    subscriptions
      .filter(subscription => subscription.isActive)
      .forEach(subscription => {
        const monthlyAmount = subscription.billingCycle === 'Yearly' 
          ? subscription.amount / 12 
          : subscription.amount;
        categories[subscription.category] += monthlyAmount;
      });
    
    const totalSpend = calculateTotalMonthlySpend();
    
    // Check if we already have an entry for this month
    const existingIndex = spendingHistory.findIndex(
      item => item.month === currentMonth && item.year === currentYear
    );
    
    if (existingIndex >= 0) {
      // Update existing record
      const updatedHistory = [...spendingHistory];
      updatedHistory[existingIndex] = {
        month: currentMonth,
        year: currentYear,
        totalSpend,
        categories
      };
      setSpendingHistory(updatedHistory);
    } else {
      // Add new record
      setSpendingHistory([
        ...spendingHistory, 
        {
          month: currentMonth,
          year: currentYear,
          totalSpend,
          categories
        }
      ]);
    }
  };
  
  const getMonthlySpendingTrend = () => {
    return spendingHistory
      .sort((a, b) => {
        // Sort by year and then by month index
        const monthsOrder = ["January", "February", "March", "April", "May", "June",
                             "July", "August", "September", "October", "November", "December"];
        if (a.year !== b.year) return a.year - b.year;
        return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
      })
      .map(item => ({
        month: `${item.month.substring(0, 3)} ${item.year}`,
        amount: item.totalSpend
      }));
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        user,
        spendingHistory,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        updateUser,
        calculateTotalMonthlySpend,
        getUpcomingRenewals,
        getSubscriptionsByCategory,
        getTrialSubscriptions,
        addReceiptToSubscription,
        recordMonthlySpending,
        getMonthlySpendingTrend,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
