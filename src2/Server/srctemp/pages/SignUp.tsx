
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isAuthenticated, signup, signInWithGoogle, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    await signup(email, password, name);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 opacity-90"></div>
        
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite'
          }}
        ></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          {/* Large floating circles with different animations */}
          <div 
            className="absolute w-96 h-96 rounded-full opacity-20 animate-float"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              top: '-10%',
              left: '-10%'
            }}
          ></div>
          
          <div 
            className="absolute w-80 h-80 rounded-full opacity-15 animate-float animation-delay-2000"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              top: '20%',
              right: '-15%'
            }}
          ></div>
          
          <div 
            className="absolute w-64 h-64 rounded-full opacity-25 animate-float animation-delay-4000"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              bottom: '-10%',
              left: '30%'
            }}
          ></div>
          
          {/* Wavy lines inspired by the reference image */}
          <svg className="absolute inset-0 w-full h-full animate-wave" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.3">
                  <animate attributeName="stop-color" 
                    values="#667eea;#764ba2;#f093fb;#667eea" 
                    dur="8s" 
                    repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#f093fb" stopOpacity="0.2">
                  <animate attributeName="stop-color" 
                    values="#f093fb;#f5576c;#4facfe;#f093fb" 
                    dur="10s" 
                    repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#4facfe" stopOpacity="0.3">
                  <animate attributeName="stop-color" 
                    values="#4facfe;#00f2fe;#667eea;#4facfe" 
                    dur="12s" 
                    repeatCount="indefinite" />
                </stop>
              </linearGradient>
              
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#764ba2" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#f5576c" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            <path 
              d="M0,300 Q300,100 600,300 T1200,300 L1200,800 L0,800 Z" 
              fill="url(#waveGradient1)"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;50,20;0,0"
                dur="15s"
                repeatCount="indefinite"
              />
            </path>
            
            <path 
              d="M0,400 Q400,200 800,400 T1200,400 L1200,800 L0,800 Z" 
              fill="url(#waveGradient2)"
              className="animate-wave-reverse"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-30,-10;0,0"
                dur="20s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
          
          {/* Geometric shapes */}
          <div 
            className="absolute w-16 h-16 border-2 border-white opacity-30 rotate-45"
            style={{
              top: '20%',
              left: '10%',
              animation: 'rotate 30s linear infinite'
            }}
          ></div>
          
          <div 
            className="absolute w-12 h-12 bg-white opacity-20 rotate-12 animate-float"
            style={{
              bottom: '30%',
              right: '20%',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          ></div>
        </div>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="w-full max-w-md relative z-10 p-4">
        {/* Logo with enhanced styling */}
        <div className="flex justify-center mb-8">
          <div 
            className="text-5xl font-bold text-white animate-pulse"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
              background: 'linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'glow 3s ease-in-out infinite alternate'
            }}
          >
            Eventrix
          </div>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Create an Account</CardTitle>
            <CardDescription className="text-gray-200">
              Join Eventrix to discover and create amazing events
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 backdrop-blur-sm transition-all duration-300 focus:scale-105 focus:shadow-lg focus:bg-white/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 backdrop-blur-sm transition-all duration-300 focus:scale-105 focus:shadow-lg focus:bg-white/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 backdrop-blur-sm transition-all duration-300 focus:scale-105 focus:shadow-lg focus:bg-white/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 backdrop-blur-sm transition-all duration-300 focus:scale-105 focus:shadow-lg focus:bg-white/30"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/30"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-gray-200">Or continue with</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </CardContent>
          
          <CardFooter>
            <p className="text-center text-sm text-gray-200 mt-2 w-full">
              Already have an account?{" "}
              <Link to="/signin" className="text-white hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
