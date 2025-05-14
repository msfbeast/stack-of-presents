
import React from 'react';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/context/SubscriptionContext';
import { format } from 'date-fns';

interface RenewalCardProps {
  subscription: Subscription;
  onRenew: () => void;
  onCancel: () => void;
}

const getSubscriptionLogo = (name: string) => {
  switch (name.toLowerCase()) {
    case 'netflix':
      return 'N';
    case 'spotify':
      return 'S';
    case 'amazon prime':
      return 'A';
    case 'adobe creative cloud':
      return 'Ad';
    case 'hellofresh':
      return 'HF';
    case 'apple music':
      return '🎵';
    case 'amazon shopping':
      return '🛍️';
    case 'fitness gym':
      return '💪';
    default:
      return name.charAt(0).toUpperCase();
  }
};

const getCategoryColor = (subscription: Subscription) => {
  switch (subscription.category) {
    case 'Entertainment':
      return 'bg-[hsl(var(--entertainment-bg))]';
    case 'Music':
      return 'bg-[hsl(var(--music-bg))]';
    case 'Food':
      return 'bg-[hsl(var(--food-bg))]';
    case 'Productivity':
      return 'bg-[hsl(var(--productivity-bg))]';
    case 'Shopping':
      return 'bg-[hsl(var(--shopping-bg))]';
    case 'Health & Fitness':
      return 'bg-[hsl(var(--health-bg))]';
    default:
      return 'bg-gray-100';
  }
};

const RenewalCard: React.FC<RenewalCardProps> = ({ subscription, onRenew, onCancel }) => {
  const logoColor = getCategoryColor(subscription);
  
  return (
    <div className="flex items-center justify-between rounded-2xl p-3 bg-white shadow-soft my-2">
      <div className="flex items-center">
        <div className={`${logoColor} w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-sm font-semibold`}>
          {getSubscriptionLogo(subscription.name)}
        </div>
        <div>
          <p className="font-medium text-sm">{subscription.name}</p>
          <p className="text-xs text-gray-500">
            {subscription.category}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <p className="font-semibold">${subscription.amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500">
          {format(subscription.renewalDate, 'MMM d')}
        </p>
      </div>
      
      <div className="flex ml-4 space-x-2">
        <Button variant="outline" size="sm" className="text-xs px-3 py-1 bg-green-50 text-green-600 border-green-100 hover:bg-green-100" onClick={onRenew}>
          Renew
        </Button>
        <Button variant="outline" size="sm" className="text-xs px-3 py-1 bg-red-50 text-red-500 border-red-100 hover:bg-red-100" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RenewalCard;
