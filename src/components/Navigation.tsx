
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-soft flex justify-around py-3 px-6 z-10">
      <Link 
        to="/" 
        className={cn(
          "flex flex-col items-center text-xs",
          isActive('/') ? "text-primary font-medium" : "text-gray-500"
        )}
      >
        <Home size={20} className="mb-1" />
        <span>Home</span>
      </Link>
      
      <Link 
        to="/add-subscription" 
        className={cn(
          "flex flex-col items-center text-xs",
          isActive('/add-subscription') ? "text-primary font-medium" : "text-gray-500"
        )}
      >
        <PlusCircle size={20} className="mb-1" />
        <span>Add</span>
      </Link>
      
      <Link 
        to="/settings" 
        className={cn(
          "flex flex-col items-center text-xs",
          isActive('/settings') ? "text-primary font-medium" : "text-gray-500"
        )}
      >
        <Settings size={20} className="mb-1" />
        <span>Settings</span>
      </Link>
    </div>
  );
};

export default Navigation;
