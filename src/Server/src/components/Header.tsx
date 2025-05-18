
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Calendar, Plus, Home } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const navLinkClasses = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors";
  const activeNavLinkClasses = "bg-eventrix/10 text-eventrix dark:bg-eventrix-dark/20 dark:text-eventrix-light";
  const inactiveNavLinkClasses = "text-gray-600 hover:bg-gray-100 hover:text-eventrix dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-eventrix-light";

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-eventrix flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Eventrix
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(navLinkClasses, isActive ? activeNavLinkClasses : inactiveNavLinkClasses)
              }
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>
            <NavLink
              to="/registered-events"
              className={({ isActive }) =>
                cn(navLinkClasses, isActive ? activeNavLinkClasses : inactiveNavLinkClasses)
              }
            >
              <Calendar className="h-4 w-4" />
              My Registrations
            </NavLink>
            <NavLink
              to="/my-events"
              className={({ isActive }) =>
                cn(navLinkClasses, isActive ? activeNavLinkClasses : inactiveNavLinkClasses)
              }
            >
              <User className="h-4 w-4" />
              My Events
            </NavLink>
            <NavLink
              to="/create-event"
              className={({ isActive }) =>
                cn(navLinkClasses, isActive ? activeNavLinkClasses : inactiveNavLinkClasses)
              }
            >
              <Plus className="h-4 w-4" />
              Create Event
            </NavLink>
          </nav>

          {/* Right section - User Menu and Create Button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profilePicture || "https://github.com/shadcn.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 dark:bg-gray-800" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <nav className="md:hidden border-t dark:border-gray-700 py-2 px-4 bg-white dark:bg-gray-900">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn("block py-2", isActive ? "text-eventrix dark:text-eventrix-light" : "text-gray-600 dark:text-gray-300")
            }
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </div>
          </NavLink>
          <NavLink
            to="/registered-events"
            className={({ isActive }) =>
              cn("block py-2", isActive ? "text-eventrix dark:text-eventrix-light" : "text-gray-600 dark:text-gray-300")
            }
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              My Registrations
            </div>
          </NavLink>
          <NavLink
            to="/my-events"
            className={({ isActive }) =>
              cn("block py-2", isActive ? "text-eventrix dark:text-eventrix-light" : "text-gray-600 dark:text-gray-300")
            }
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              My Events
            </div>
          </NavLink>
          <NavLink
            to="/create-event"
            className={({ isActive }) =>
              cn("block py-2", isActive ? "text-eventrix dark:text-eventrix-light" : "text-gray-600 dark:text-gray-300")
            }
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </div>
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;
