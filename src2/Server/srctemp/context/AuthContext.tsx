
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthContextType } from '../types';
import { useToast } from "@/hooks/use-toast";

// Placeholder data for demo purposes
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'demo@eventrix.com',
    name: 'Demo User',
    profilePicture: 'https://api.dicebear.com/6.x/avataaars/svg?seed=demo'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in (simulated)
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('eventrixUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in the demo data
      const foundUser = DEMO_USERS.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('eventrixUser', JSON.stringify(foundUser));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${foundUser.name}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the first demo user
      const googleUser = DEMO_USERS[0];
      setUser(googleUser);
      localStorage.setItem('eventrixUser', JSON.stringify(googleUser));
      
      toast({
        title: "Google sign-in successful",
        description: `Welcome, ${googleUser.name}!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        profilePicture: `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`
      };
      
      setUser(newUser);
      localStorage.setItem('eventrixUser', JSON.stringify(newUser));
      
      toast({
        title: "Account created successfully",
        description: `Welcome to Eventrix, ${name}!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem('eventrixUser');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signInWithGoogle,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
