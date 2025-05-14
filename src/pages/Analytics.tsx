
import React from 'react';
import Navigation from '@/components/Navigation';
import { useSubscription } from '@/context/SubscriptionContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const Analytics: React.FC = () => {
  const { 
    calculateTotalMonthlySpend, 
    spendingHistory, 
    getSubscriptionsByCategory,
    getMonthlySpendingTrend
  } = useSubscription();
  const navigate = useNavigate();
  
  const monthlyTrendData = getMonthlySpendingTrend();
  
  // Prepare category data for pie chart
  const categoryData = Object.entries(getSubscriptionsByCategory())
    .map(([category, subscriptions]) => {
      const totalAmount = subscriptions.reduce((total, sub) => {
        if (sub.billingCycle === 'Yearly') {
          return total + (sub.amount / 12);
        }
        return total + sub.amount;
      }, 0);
      
      return {
        name: category,
        value: totalAmount
      };
    })
    .filter(item => item.value > 0);
  
  const CATEGORY_COLORS = {
    'Entertainment': '#8884d8',
    'Music': '#FF8042',
    'Food': '#82ca9d',
    'Productivity': '#8dd1e1',
    'Shopping': '#a4de6c',
    'Health & Fitness': '#ffc658'
  };
  
  // Get average monthly spend
  const averageSpend = spendingHistory.length > 0 
    ? spendingHistory.reduce((total, record) => total + record.totalSpend, 0) / spendingHistory.length
    : 0;
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <Button variant="ghost" size="sm" className="mr-2 p-0" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold">Analytics</h1>
      </div>
      
      <div className="px-6 py-4 space-y-8">
        {/* Monthly Spending Overview */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Monthly Spending Overview</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gray-50 border">
              <p className="text-sm text-gray-500 mb-1">Current Monthly</p>
              <p className="text-2xl font-bold">${calculateTotalMonthlySpend().toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border">
              <p className="text-sm text-gray-500 mb-1">Average Monthly</p>
              <p className="text-2xl font-bold">${averageSpend.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="h-64 rounded-2xl bg-gray-50 border p-4">
            <h3 className="text-sm font-medium mb-4">Spending Trend</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart
                data={monthlyTrendData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--primary)" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div>
          <h2 className="text-lg font-medium mb-4">Category Distribution</h2>
          <div className="h-80 rounded-2xl bg-gray-50 border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#000'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Comparison */}
        <div className="pb-12">
          <h2 className="text-lg font-medium mb-4">Category Comparison</h2>
          <div className="h-64 rounded-2xl bg-gray-50 border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#000'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Analytics;
