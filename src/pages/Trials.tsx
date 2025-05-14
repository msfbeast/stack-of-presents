
import React from 'react';
import Navigation from '@/components/Navigation';
import { useSubscription } from '@/context/SubscriptionContext';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Trials: React.FC = () => {
  const { getTrialSubscriptions, updateSubscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const trialSubscriptions = getTrialSubscriptions();
  
  const handleExtendTrial = (id: string) => {
    const subscription = trialSubscriptions.find(sub => sub.id === id);
    if (!subscription || !subscription.trialEndDate) return;
    
    const newEndDate = new Date(subscription.trialEndDate);
    newEndDate.setDate(newEndDate.getDate() + 7);
    
    updateSubscription(id, { trialEndDate: newEndDate });
    
    toast({
      title: "Trial Extended",
      description: `${subscription.name} trial extended by 7 days.`,
    });
  };
  
  const handleConvertToPaid = (id: string) => {
    updateSubscription(id, { isFreeTrial: false });
    
    const subscription = trialSubscriptions.find(sub => sub.id === id);
    if (subscription) {
      toast({
        title: "Converted to Paid",
        description: `${subscription.name} is now a regular subscription.`,
      });
    }
  };
  
  const handleCancelTrial = (id: string) => {
    updateSubscription(id, { isActive: false });
    
    const subscription = trialSubscriptions.find(sub => sub.id === id);
    if (subscription) {
      toast({
        title: "Trial Cancelled",
        description: `${subscription.name} trial has been cancelled.`,
        variant: "destructive",
      });
    }
  };
  
  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    return differenceInDays(endDate, today);
  };
  
  const getTrialStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 1) return "text-red-500";
    if (daysRemaining <= 3) return "text-orange-500";
    return "text-green-500";
  };
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <Button variant="ghost" size="sm" className="mr-2 p-0" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold">Free Trials</h1>
      </div>
      
      <div className="px-6 py-4 space-y-4">
        <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl">
          <div className="mt-1">
            <AlertCircle size={18} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-700">Trial Management</h3>
            <p className="text-xs text-blue-600">
              Track your free trials here to avoid unexpected charges when they convert to paid subscriptions.
            </p>
          </div>
        </div>
        
        {trialSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {trialSubscriptions.map(subscription => {
              const daysRemaining = subscription.trialEndDate ? 
                getDaysRemaining(subscription.trialEndDate) : 0;
                
              return (
                <div key={subscription.id} className="p-4 border rounded-xl bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{subscription.name}</h3>
                      <p className="text-sm text-gray-500">{subscription.category}</p>
                    </div>
                    <div className={`text-sm font-medium ${getTrialStatusColor(daysRemaining)}`}>
                      {daysRemaining <= 0 ? "Ends today" : `${daysRemaining} days left`}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Clock size={14} className="mr-1" />
                    <span>Trial ends: </span>
                    <span className="ml-1 font-medium">
                      {subscription.trialEndDate ? format(subscription.trialEndDate, 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar size={14} className="mr-1" />
                    <span>Converts to: </span>
                    <span className="ml-1 font-medium">
                      ${subscription.amount.toFixed(2)}/{subscription.billingCycle.toLowerCase()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs flex-1"
                      onClick={() => handleExtendTrial(subscription.id)}
                    >
                      Extend Trial
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs flex-1"
                      onClick={() => handleConvertToPaid(subscription.id)}
                    >
                      Convert to Paid
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-red-500 flex-1"
                      onClick={() => handleCancelTrial(subscription.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-500 mb-2">No active trials</h3>
            <p className="text-sm text-gray-400 mb-4">
              You don't have any free trials tracking at the moment.
            </p>
            <Button onClick={() => navigate('/add-subscription')} className="rounded-xl">
              Add a Trial Subscription
            </Button>
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Trials;
