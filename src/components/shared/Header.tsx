import { useState } from "react";
import {
  Moon,
  Sun,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bath,
  Shuffle,
  HandCoins,
} from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useThemeStore } from "@/store/themeStore";
import useUserAuth from "@/hooks/controllers/useUserAuth";

// Simple theme toggle component
const ModeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-sky-500 shadow-xl shadow-sky-500/50 cursor-pointer bg-transparent rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

const Header = () => {
    const { data:userAuth } = useUserAuth();
  const { theme } = useThemeStore();

  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    alert("test");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: "/",
    },
    {
      label: "Services",
      icon: <Bath className="h-4 w-4 mr-2" />,
      href: "/services",
    },
    {
      label: " Bookings",
      icon: <Shuffle className="h-4 w-4 mr-2" />,
      href: "/bookings",
    },
    {
      label: "Messages",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      href: "/messages",
    },
    {
      label: "Payment Method",
      icon: <HandCoins className="h-4 w-4 mr-2" />,
      href: "/payment-method",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={theme === "dark" ? "/logo-funeral-dark.png":"/white-logo.png"} alt="Memorial" className=" w-[45%]" />  
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <div
                className={`relative flex items-center text-sm cursor-pointer ${
                  isActive(item.href)
                    ? "font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          
          <ModeToggle />
          <Link to="/profile">
            <Avatar className="text-sky-500 shadow-xl shadow-violet-500/50">
              <AvatarImage src={userAuth?.data?.profileUrl || "/empty.webp"}  alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <div
                  className={`flex items-center py-2 text-sm font-medium cursor-pointer ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center py-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
