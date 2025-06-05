
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import RegisteredEvents from "./pages/RegisteredEvents";
import MyEvents from "./pages/MyEvents";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import EventEngagement from "./pages/EventEngagement";
import LikedEvents from "./pages/LikedEvents";
import Profile from "./pages/Profile";
import TicketingSchedulingPricing from "./pages/TicketingSchedulingPricing";
import PaidEvents from "./pages/PaidEvents";
import UnpaidEvents from "./pages/UnpaidEvents";

const queryClient = new QueryClient();

// Location permissions component
const LocationPermissions = () => {
  useEffect(() => {
    const requestLocationPermission = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location permission granted');
            localStorage.setItem('locationPermission', 'granted');
          },
          (error) => {
            console.log('Location permission denied');
            localStorage.setItem('locationPermission', 'denied');
          }
        );
      }
    };

    const hasAskedPermission = localStorage.getItem('locationPermission');
    if (!hasAskedPermission) {
      setTimeout(requestLocationPermission, 1000);
    }
  }, []);

  return null;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return (
    <>
      <LocationPermissions />
      {children}
    </>
  );
};

// App routes with auth provider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/liked-events" element={
        <ProtectedRoute>
          <LikedEvents />
        </ProtectedRoute>
      } />
      
      <Route path="/registered-events" element={
        <ProtectedRoute>
          <RegisteredEvents />
        </ProtectedRoute>
      } />
      
      <Route path="/paid-events" element={
        <ProtectedRoute>
          <PaidEvents />
        </ProtectedRoute>
      } />
      
      <Route path="/unpaid-events" element={
        <ProtectedRoute>
          <UnpaidEvents />
        </ProtectedRoute>
      } />
      
      <Route path="/my-events" element={
        <ProtectedRoute>
          <MyEvents />
        </ProtectedRoute>
      } />
      
      <Route path="/create-event" element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      } />
      
      <Route path="/ticketing-scheduling-pricing" element={
        <ProtectedRoute>
          <TicketingSchedulingPricing />
        </ProtectedRoute>
      } />
      
      <Route path="/events/:eventId" element={
        <ProtectedRoute>
          <EventDetails />
        </ProtectedRoute>
      } />
      
      <Route path="/events/:eventId/engage" element={
        <ProtectedRoute>
          <EventEngagement />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <AppRoutes />
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
