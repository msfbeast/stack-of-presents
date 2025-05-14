
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Settings, PieChart, Clock, FileText } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-between p-3 px-6">
      <Link to="/">
        <Button variant={isActive('/') ? "default" : "ghost"} size="sm" className="flex flex-col h-14 w-14 rounded-xl">
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </Button>
      </Link>
      
      <Link to="/analytics">
        <Button variant={isActive('/analytics') ? "default" : "ghost"} size="sm" className="flex flex-col h-14 w-14 rounded-xl">
          <PieChart size={20} />
          <span className="text-[10px] mt-1">Analytics</span>
        </Button>
      </Link>
      
      <Link to="/add-subscription">
        <Button variant="default" size="sm" className="flex flex-col h-14 w-14 rounded-xl">
          <Plus size={20} />
          <span className="text-[10px] mt-1">Add</span>
        </Button>
      </Link>
      
      <Link to="/trials">
        <Button variant={isActive('/trials') ? "default" : "ghost"} size="sm" className="flex flex-col h-14 w-14 rounded-xl">
          <Clock size={20} />
          <span className="text-[10px] mt-1">Trials</span>
        </Button>
      </Link>
      
      <Link to="/receipts">
        <Button variant={isActive('/receipts') ? "default" : "ghost"} size="sm" className="flex flex-col h-14 w-14 rounded-xl">
          <FileText size={20} />
          <span className="text-[10px] mt-1">Receipts</span>
        </Button>
      </Link>
      
      <Link to="/settings">
        <Button variant={isActive('/settings') ? "default" : "ghost"} size="sm" className="flex flex-col h-14 w-14 rounded-xl">
          <Settings size={20} />
          <span className="text-[10px] mt-1">Settings</span>
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
