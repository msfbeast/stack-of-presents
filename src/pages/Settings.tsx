
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Download, Moon, Bell } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user, updateUser } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCurrencyChange = (currency: string) => {
    updateUser({ preferredCurrency: currency });
    toast({
      title: "Currency Updated",
      description: `Your preferred currency is now ${currency}.`,
    });
  };
  
  const handleDarkModeToggle = (checked: boolean) => {
    updateUser({ darkMode: checked });
    // In a real app, this would also apply the dark mode theme
    toast({
      title: checked ? "Dark Mode Enabled" : "Dark Mode Disabled",
      description: checked ? "The dark theme has been applied." : "The light theme has been applied.",
    });
  };
  
  const handleReminderDaysChange = (days: string) => {
    updateUser({ reminderDays: parseInt(days) });
    toast({
      title: "Reminder Settings Updated",
      description: `You'll now be reminded ${days} days before renewal.`,
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Your subscription data has been exported.",
    });
  };
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <Button variant="ghost" size="sm" className="mr-2 p-0" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>
      
      <div className="px-6 py-6 space-y-8">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon size={20} className="mr-3 text-gray-600" />
            <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={user.darkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>
        
        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="font-medium">Currency</Label>
          <Select value={user.preferredCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger id="currency" className="rounded-xl h-12">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Reminder Preferences */}
        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <Bell size={20} className="mr-3 text-gray-600" />
            <Label htmlFor="reminder-days" className="font-medium">Reminder Preferences</Label>
          </div>
          <Select 
            value={user.reminderDays.toString()} 
            onValueChange={handleReminderDaysChange}
          >
            <SelectTrigger id="reminder-days" className="rounded-xl h-12">
              <SelectValue placeholder="Remind me before renewal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day before</SelectItem>
              <SelectItem value="3">3 days before</SelectItem>
              <SelectItem value="7">7 days before</SelectItem>
              <SelectItem value="14">14 days before</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Export Data */}
        <div className="space-y-2">
          <Label htmlFor="export-data" className="font-medium">Export Data</Label>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12"
              onClick={handleExportData}
            >
              <Download size={16} className="mr-2" />
              Export as PDF
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12"
              onClick={handleExportData}
            >
              <Download size={16} className="mr-2" />
              Export as CSV
            </Button>
          </div>
        </div>
        
        {/* Account Info */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">Signed in as: {user.email || 'Guest User'}</p>
          <Button variant="ghost" className="text-primary mt-2 p-0">Log out</Button>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Settings;
