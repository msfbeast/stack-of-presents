
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useSubscription();

  useEffect(() => {
    // Redirect to either signup or dashboard based on auth status
    if (user.email) {
      navigate("/");
    } else {
      navigate("/signup");
    }
  }, [navigate, user.email]);

  // Loading screen while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">OneStack</h1>
        <p className="text-gray-500">Loading your subscriptions...</p>
      </div>
    </div>
  );
};

export default Index;
