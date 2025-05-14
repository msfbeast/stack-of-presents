
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useSubscription } from '@/context/SubscriptionContext';
import { ArrowLeft, Upload, X, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Receipts: React.FC = () => {
  const { subscriptions, addReceiptToSubscription, updateSubscription } = useSubscription();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  
  const handleAddReceipt = () => {
    if (!selectedSubscriptionId || !receiptUrl) {
      toast({
        title: "Missing Information",
        description: "Please select a subscription and provide a receipt URL.",
        variant: "destructive",
      });
      return;
    }
    
    addReceiptToSubscription(selectedSubscriptionId, receiptUrl);
    
    toast({
      title: "Receipt Added",
      description: "The receipt has been successfully added to your subscription.",
    });
    
    // Reset form
    setSelectedSubscriptionId(null);
    setReceiptUrl('');
  };
  
  const handleRemoveReceipt = (id: string) => {
    updateSubscription(id, { receiptUrl: undefined });
    
    toast({
      title: "Receipt Removed",
      description: "The receipt has been removed from your subscription.",
    });
  };
  
  const subscriptionsWithReceipts = subscriptions.filter(sub => sub.receiptUrl);
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <Button variant="ghost" size="sm" className="mr-2 p-0" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold">Receipts & Invoices</h1>
      </div>
      
      <div className="px-6 py-4 space-y-6">
        {/* Add new receipt */}
        <div className="p-4 border rounded-xl">
          <h2 className="text-lg font-medium mb-3">Add New Receipt</h2>
          
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm mb-1">Select Subscription</label>
              <select
                className="w-full rounded-xl px-3 py-2 border"
                value={selectedSubscriptionId || ''}
                onChange={(e) => setSelectedSubscriptionId(e.target.value || null)}
              >
                <option value="">-- Select a subscription --</option>
                {activeSubscriptions.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (${sub.amount.toFixed(2)}/{sub.billingCycle === 'Monthly' ? 'mo' : 'yr'})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Receipt URL or Notes</label>
              <Input
                placeholder="https://receipt-url.com or notes about your receipt"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          
          <Button 
            className="w-full rounded-xl flex items-center justify-center"
            onClick={handleAddReceipt}
          >
            <Upload size={16} className="mr-1" /> Add Receipt
          </Button>
        </div>
        
        {/* Receipts list */}
        <div>
          <h2 className="text-lg font-medium mb-3">Saved Receipts</h2>
          
          {subscriptionsWithReceipts.length > 0 ? (
            <div className="space-y-3">
              {subscriptionsWithReceipts.map(subscription => (
                <div key={subscription.id} className="p-3 border rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{subscription.name}</h3>
                      <p className="text-xs text-gray-500">
                        ${subscription.amount.toFixed(2)}/{subscription.billingCycle.toLowerCase()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemoveReceipt(subscription.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    {subscription.receiptUrl?.startsWith('http') ? (
                      <a 
                        href={subscription.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary"
                      >
                        <FileText size={14} className="mr-1" />
                        View Receipt
                        <Download size={14} className="ml-1" />
                      </a>
                    ) : (
                      <div className="flex items-start">
                        <FileText size={14} className="mr-1 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">{subscription.receiptUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-xl">
              <FileText size={32} className="mx-auto text-gray-300 mb-2" />
              <h3 className="text-gray-500">No receipts saved yet</h3>
              <p className="text-xs text-gray-400 mt-1">
                Add your first receipt using the form above
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Receipts;
