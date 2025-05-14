
import React from 'react';
import { Category, Subscription } from '@/context/SubscriptionContext';

interface CategoryCardProps {
  category: Category;
  subscriptions: Subscription[];
  amount: number;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Entertainment':
      return '🍿';
    case 'Music':
      return '🎵';
    case 'Food':
      return '🍽️';
    case 'Productivity':
      return '📊';
    case 'Shopping':
      return '🛍️';
    case 'Health & Fitness':
      return '💪';
    default:
      return '📦';
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, subscriptions, amount }) => {
  const cardClass = `card-${category.toLowerCase().replace(' & ', '-')}`;

  return (
    <div className={`${cardClass} rounded-3xl p-4 shadow-card`}>
      <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
      <h3 className="font-medium text-sm mb-1">{category}</h3>
      <p className="text-xs text-gray-600 mb-3">
        {subscriptions.length} {subscriptions.length === 1 ? 'renewal' : 'renewals'}
      </p>
      <p className="font-semibold text-base">${amount.toFixed(2)}/m</p>
    </div>
  );
};

export default CategoryCard;
