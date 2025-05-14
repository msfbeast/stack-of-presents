
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const { updateUser } = useSubscription();
  const navigate = useNavigate();
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      updateUser({ email });
      navigate('/');
    }
  };
  
  const handleGoogleSignIn = () => {
    updateUser({ email: 'user@example.com' });
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-between py-12 px-6">
      {/* Background icons */}
      <div className="absolute top-32 left-0 blur-icon text-5xl">🎵</div>
      <div className="absolute top-40 right-12 blur-icon text-5xl">🍔</div>
      <div className="absolute bottom-52 left-12 blur-icon text-5xl">🛍️</div>
      <div className="absolute bottom-60 right-0 blur-icon text-5xl">📱</div>
      
      <div></div> {/* Spacer */}
      
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg mr-2"></div>
            <h1 className="text-3xl font-bold">OneStack</h1>
          </div>
          <h2 className="text-center text-3xl font-bold mb-4">
            Sign up to 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"> OneStack</span>
          </h2>
        </div>
        
        <form onSubmit={handleSignUp} className="w-full">
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-12 px-4 w-full bg-gray-100"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full rounded-xl h-12 font-medium"
          >
            Sign up
          </Button>
        </form>
        
        <div className="my-6 text-gray-400 w-full text-center">Or</div>
        
        <Button 
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full rounded-xl h-12 bg-black text-white font-medium flex items-center justify-center space-x-2 hover:bg-gray-800"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        Already have an account? <span className="text-primary font-medium">Log In</span>
      </div>
    </div>
  );
};

export default SignUp;
