import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  LogOut,
  User,
  Menu,
  X,
  Bath,
  TvMinimalPlay,
  Mail,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLocation } from "wouter";
import { Link } from "react-router-dom";

// Simple theme toggle component
const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-lg"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    alert("test");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Array of nav items for easy scalability and management
  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: "/customer/dashboard",
    },
    {
      label: "Services",
      icon: <Bath className="h-4 w-4 mr-2" />,
      href: "/services",
    },
    {
      label: "My Bookings",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      href: "/bookings",
    },
    {
      label: "Online Burial",
      icon: <TvMinimalPlay className="h-4 w-4 mr-2" />,
      href: "/online-burial",
    },
    {
      label: "Messages",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      href: "/messages",
    },
    {
      label: "Profile",
      icon: <User className="h-4 w-4 mr-2" />,
      href: "/profile",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/mockLogo.png" alt="Memorial" className="h-10 w-10" />
              <span className="font-bold hidden sm:inline-block">
                Memorial Services
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <div
                className={`flex items-center text-sm font-medium cursor-pointer ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button><Mail /></button>
          <ModeToggle />
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hidden md:flex items-center py-5 px-7 rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>

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
