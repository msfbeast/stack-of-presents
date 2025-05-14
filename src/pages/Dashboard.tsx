
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import RenewalCard from '@/components/RenewalCard';
import Navigation from '@/components/Navigation';
import { Search, Settings } from 'lucide-react';
import { useSubscription, Category } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { calculateTotalMonthlySpend, getUpcomingRenewals, getSubscriptionsByCategory, updateSubscription } = useSubscription();
  const [renewalFilter, setRenewalFilter] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const totalMonthlySpend = calculateTotalMonthlySpend();
  const upcomingRenewals = getUpcomingRenewals();
  const subscriptionsByCategory = getSubscriptionsByCategory();
  
  const handleRenew = (id: string) => {
    // In a real app, this would handle the renewal process
    toast({
      title: "Subscription Renewed",
      description: "Your subscription has been successfully renewed.",
    });
  };
  
  const handleCancel = (id: string) => {
    updateSubscription(id, { isActive: false });
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled.",
      variant: "destructive",
    });
  };

  const categoryEntries = Object.entries(subscriptionsByCategory) as [Category, typeof subscriptionsByCategory[Category]][];
  
  // Calculate total amount per category
  const getCategoryTotal = (subscriptions: typeof subscriptionsByCategory[Category]) => {
    return subscriptions.reduce((total, sub) => {
      if (sub.billingCycle === 'Yearly') {
        return total + sub.amount / 12;
      }
      return total + sub.amount;
    }, 0);
  };
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <div className="h-6 w-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg mr-2"></div>
          <span className="text-sm text-gray-400">OneStack</span>
        </div>
        <div className="flex items-center space-x-3">
          <Search size={18} className="text-gray-500" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 p-0" 
            onClick={() => navigate('/settings')}
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>
      
      {/* Total Spending Section */}
      <div className="px-6 py-3">
        <h2 className="text-sm text-gray-500 mb-2">Total spendings</h2>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">${totalMonthlySpend.toFixed(2)}/m</h1>
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            View all
          </Button>
        </div>
      </div>
      
      {/* Category Cards */}
      <div className="px-6 py-4">
        <h2 className="text-base font-medium mb-3">Subscriptions</h2>
        <div className="grid grid-cols-2 gap-4">
          {categoryEntries.map(([category, subscriptions]) => {
            if (subscriptions.length === 0) return null;
            return (
              <CategoryCard 
                key={category}
                category={category}
                subscriptions={subscriptions}
                amount={getCategoryTotal(subscriptions)}
              />
            );
          })}
        </div>
        
        <div className="flex justify-end mt-2">
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            View all
          </Button>
        </div>
      </div>
      
      {/* Upcoming Renewals */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium">Upcoming renewals</h2>
          <div className="flex bg-gray-100 rounded-lg p-1 text-xs">
            <Button
              size="sm"
              variant="ghost"
              className={`px-3 py-1 rounded-md ${
                renewalFilter === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setRenewalFilter('monthly')}
            >
              Monthly
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`px-3 py-1 rounded-md ${
                renewalFilter === 'yearly' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setRenewalFilter('yearly')}
            >
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {upcomingRenewals
            .filter(sub => renewalFilter === 'monthly' ? sub.billingCycle === 'Monthly' : sub.billingCycle === 'Yearly')
            .slice(0, 5)
            .map(subscription => (
              <RenewalCard
                key={subscription.id}
                subscription={subscription}
                onRenew={() => handleRenew(subscription.id)}
                onCancel={() => handleCancel(subscription.id)}
              />
            ))}
            
          {upcomingRenewals.filter(sub => renewalFilter === 'monthly' ? sub.billingCycle === 'Monthly' : sub.billingCycle === 'Yearly').length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No upcoming {renewalFilter} renewals
            </div>
          )}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Dashboard;
