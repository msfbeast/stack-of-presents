
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SubscriptionProvider, useSubscription } from "./context/SubscriptionContext";

// Pages
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AddSubscription from "./pages/AddSubscription";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Trials from "./pages/Trials";
import Receipts from "./pages/Receipts";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Check if user is authenticated
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Small timeout to avoid flash of login screen during hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user.email) {
    return <Navigate to="/signup" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useSubscription();
  
  return (
    <Routes>
      <Route path="/signup" element={user.email ? <Navigate to="/" replace /> : <SignUp />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/add-subscription" element={<RequireAuth><AddSubscription /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
      <Route path="/trials" element={<RequireAuth><Trials /></RequireAuth>} />
      <Route path="/receipts" element={<RequireAuth><Receipts /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SubscriptionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </SubscriptionProvider>
  </QueryClientProvider>
);

export default App;
