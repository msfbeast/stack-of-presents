
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useSubscription, Category, BillingCycle } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const AddSubscription: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle | ''>('');
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(new Date());
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [usageFrequency, setUsageFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Rarely' | ''>('');
  
  const { addSubscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category || !amount || !billingCycle || !renewalDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (isFreeTrial && !trialEndDate) {
      toast({
        title: "Missing Trial End Date",
        description: "Please select when your free trial ends.",
        variant: "destructive",
      });
      return;
    }
    
    addSubscription({
      name,
      category: category as Category,
      amount: parseFloat(amount),
      billingCycle: billingCycle as BillingCycle,
      renewalDate: renewalDate,
      isActive: true,
      isFreeTrial,
      trialEndDate,
      notes,
      usageFrequency: usageFrequency as any,
    });
    
    toast({
      title: "Subscription Added",
      description: `${name} has been added to your subscriptions.`,
    });
    
    navigate('/');
  };
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <Button variant="ghost" size="sm" className="mr-2 p-0" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold">Add New Subscription</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name of service</Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g. Netflix, Spotify"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billing-cycle">Billing cycle</Label>
          <Select value={billingCycle} onValueChange={(value) => setBillingCycle(value as BillingCycle)}>
            <SelectTrigger id="billing-cycle" className="rounded-xl h-12">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
            <SelectTrigger id="category" className="rounded-xl h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Productivity">Productivity</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="renewal-date">Renewal date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="renewal-date"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl h-12",
                  !renewalDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {renewalDate ? format(renewalDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={renewalDate}
                onSelect={setRenewalDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Free Trial Toggle */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label htmlFor="free-trial-toggle" className="font-medium">This is a free trial</Label>
              <p className="text-sm text-gray-500">Track your free trial period and get reminders before it ends</p>
            </div>
            <Switch 
              id="free-trial-toggle"
              checked={isFreeTrial}
              onCheckedChange={setIsFreeTrial}
            />
          </div>
          
          {isFreeTrial && (
            <div className="space-y-2">
              <Label htmlFor="trial-end-date">Trial end date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="trial-end-date"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl h-12",
                      !trialEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trialEndDate ? format(trialEndDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={trialEndDate}
                    onSelect={setTrialEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        
        {/* Additional Fields */}
        <div className="space-y-2">
          <Label htmlFor="usage-frequency">How often do you use this service?</Label>
          <Select value={usageFrequency} onValueChange={(value: any) => setUsageFrequency(value)}>
            <SelectTrigger id="usage-frequency" className="rounded-xl h-12">
              <SelectValue placeholder="Select usage frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Rarely">Rarely</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input
            id="notes"
            type="text"
            placeholder="Any additional notes about this subscription"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-xl h-12"
          />
        </div>
        
        <Button type="submit" className="w-full rounded-xl h-12 mt-6">
          Save Subscription
        </Button>
      </form>
      
      <Navigation />
    </div>
  );
};

export default AddSubscription;
