import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Check if current route matches
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[1000] border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GlobeAltIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              GeoExplorer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" isActive={isActive("/")}>
              Home
            </NavLink>
            <NavLink to="/countries" isActive={isActive("/countries")}>
              Countries
            </NavLink>

            {user ? (
              <>
                <NavLink to="/profile" isActive={isActive("/profile")}>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium rounded-lg hover:bg-gray-50"
                >
                  Logout
                </button>
                <div className="ml-4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" isActive={isActive("/login")}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  isActive={isActive("/register")}
                  isPrimary
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white pb-4 space-y-1">
            <MobileNavLink
              to="/"
              isActive={isActive("/")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/countries"
              isActive={isActive("/countries")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Countries
            </MobileNavLink>

            {user ? (
              <>
                <MobileNavLink
                  to="/profile"
                  isActive={isActive("/profile")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </MobileNavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 transition font-medium"
                >
                  Logout
                </button>
                <div className="px-4 py-3 flex items-center space-x-3 border-t border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink
                  to="/login"
                  isActive={isActive("/login")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </MobileNavLink>
                <MobileNavLink
                  to="/register"
                  isActive={isActive("/register")}
                  onClick={() => setMobileMenuOpen(false)}
                  isPrimary
                >
                  Register
                </MobileNavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, children, isActive, isPrimary = false }) => {
  const baseClasses =
    "px-4 py-2 transition-colors font-medium rounded-lg flex items-center space-x-1";
  const activeClasses = isActive
    ? "text-indigo-600 bg-indigo-50"
    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50";
  const primaryClasses = isPrimary
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "";

  return (
    <Link
      to={to}
      className={`${baseClasses} ${activeClasses} ${primaryClasses}`}
    >
      {children}
    </Link>
  );
};

// Reusable NavLink component for mobile
const MobileNavLink = ({
  to,
  children,
  isActive,
  onClick,
  isPrimary = false,
}) => {
  const baseClasses =
    "px-4 py-3 transition-colors font-medium flex items-center";
  const activeClasses = isActive
    ? "text-indigo-600 bg-indigo-50"
    : "text-gray-600 hover:bg-gray-50";
  const primaryClasses = isPrimary
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "";

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${primaryClasses}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
