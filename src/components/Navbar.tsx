import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "home" },
    { name: "Find Blood", path: "blood-finder" },
    { name: "Health Camps", path: "health-camps" },
    { name: "Emergency Help", path: "emergency-help" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-[#0077B6]">NSS Care Network</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`transition-colors ${
                  currentPage === link.path
                    ? "text-[#E63946]"
                    : "text-gray-700 hover:text-[#0077B6]"
                }`}
              >
                {link.name}
              </button>
            ))}
            <Button
              onClick={() => onNavigate("login")}
              className="bg-[#0077B6] hover:bg-[#005f8f]"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 transition-colors ${
                  currentPage === link.path
                    ? "text-[#E63946]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="px-4 pt-2">
              <Button
                onClick={() => {
                  onNavigate("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
