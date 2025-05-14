
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
}

export interface User {
  email: string | null;
  preferredCurrency: string;
  darkMode: boolean;
  reminderDays: number;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  user: User;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  calculateTotalMonthlySpend: () => number;
  getUpcomingRenewals: () => Subscription[];
  getSubscriptionsByCategory: () => Record<Category, Subscription[]>;
}

const DEFAULT_USER: User = {
  email: null,
  preferredCurrency: 'USD',
  darkMode: false,
  reminderDays: 3,
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

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [user, setUser] = useState<User>(DEFAULT_USER);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSubscriptions = localStorage.getItem('subscriptions');
    const storedUser = localStorage.getItem('user');

    if (storedSubscriptions) {
      const parsedSubscriptions = JSON.parse(storedSubscriptions);
      // Convert string dates back to Date objects
      parsedSubscriptions.forEach((sub: any) => {
        sub.renewalDate = new Date(sub.renewalDate);
      });
      setSubscriptions(parsedSubscriptions);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    localStorage.setItem('user', JSON.stringify(user));
  }, [subscriptions, user]);

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

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        user,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        updateUser,
        calculateTotalMonthlySpend,
        getUpcomingRenewals,
        getSubscriptionsByCategory,
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
