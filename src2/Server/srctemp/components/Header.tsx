
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Calendar, 
  Plus, 
  Heart, 
  LogOut, 
  CreditCard,
  Ban,
  DollarSign,
  Settings,
  Home
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { T } from "../hooks/useTranslation";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const navigationItems = [
    { icon: Home, label: "Home", path: "/", key: "home" },
    { icon: Calendar, label: "My Registrations", path: "/registered-events", key: "registrations" },
    { icon: CreditCard, label: "Paid Events", path: "/paid-events", key: "paid" },
    { icon: Ban, label: "Unpaid Events", path: "/unpaid-events", key: "unpaid" },
    { icon: DollarSign, label: "Ticketing & Pricing", path: "/ticketing-scheduling-pricing", key: "ticketing" },
    { icon: User, label: "My Events", path: "/my-events", key: "my-events" },
    { icon: Plus, label: "Create Event", path: "/create-event", key: "create" }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="eventrix-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-eventrix rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-eventrix dark:text-eventrix-light">
                Eventrix
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                <T>Engaging Communities</T>
              </span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 5).map((item) => (
              <Button
                key={item.key}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <T>{item.label}</T>
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback className="bg-eventrix text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <T>Profile</T>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/liked-events")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <T>Liked Events</T>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {navigationItems.slice(5).map((item) => (
                  <DropdownMenuItem key={item.key} onClick={() => navigate(item.path)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <T>{item.label}</T>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <T>Log out</T>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
