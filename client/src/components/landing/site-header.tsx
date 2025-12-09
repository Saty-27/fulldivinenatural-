import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function SiteHeader() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, isLoading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
    enabled: isAuthenticated,
  });

  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/subscription", label: "Subscription" },
    { href: "/orders", label: "My Orders" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-1 border border-gray-100">
              <img 
                src={logoImage} 
                alt="Divine Naturals" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight tracking-tight">Divine Naturals</h1>
              <p className="text-[10px] md:text-xs text-green-600 font-medium -mt-0.5">Pure. Fresh. Daily.</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  location === link.href ? "text-green-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-44 lg:w-56 px-4 py-2 pr-10 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setLocation("/cart")}
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {!isLoading && (
              isAuthenticated ? (
                <button
                  onClick={() => setLocation("/home")}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              ) : (
                <Button
                  onClick={() => setLocation("/auth/login")}
                  className="hidden md:flex bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2 rounded-full transition-all"
                >
                  Login
                </Button>
              )
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pr-12 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
              
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                      location === link.href
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {!isAuthenticated && (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLocation("/auth/login");
                  }}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl"
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
