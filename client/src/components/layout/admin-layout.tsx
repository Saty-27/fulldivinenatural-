import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Milk, 
  Store, 
  Truck, 
  Users, 
  CreditCard, 
  Package, 
  MessageSquare, 
  Tag, 
  BarChart3, 
  Bell, 
  Settings, 
  UserCog,
  Menu,
  X,
  LogOut,
  Image,
  Layout
} from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

const adminTabs = [
  { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "banners", label: "Banner Management", icon: Image, path: "/admin/banners" },
  { id: "homepage", label: "Homepage CMS", icon: Layout, path: "/admin/homepage" },
  { id: "customers", label: "Customers", icon: Users, path: "/admin/customers" },
  { id: "orders", label: "Orders", icon: Package, path: "/admin/orders" },
  { id: "subscriptions", label: "Subscriptions", icon: Milk, path: "/admin/subscriptions" },
  { id: "billing", label: "Billing Management", icon: CreditCard, path: "/admin/billing" },
  { id: "categories", label: "Categories", icon: Tag, path: "/admin/categories" },
  { id: "inventory", label: "Products", icon: Store, path: "/admin/inventory" },
  { id: "stock-history", label: "Stock History", icon: BarChart3, path: "/admin/stock-history" },
  { id: "vendors", label: "Vendors", icon: Store, path: "/admin/vendors" },
  { id: "delivery", label: "Delivery Partners", icon: Truck, path: "/admin/delivery" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTab = adminTabs.find(tab => tab.path === location) || adminTabs[0];

  return (
    <div className="min-h-screen admin-content">
      {/* Mobile Header */}
      <div className="lg:hidden admin-sidebar border-b p-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {/* Divine Naturals Tree Icon for Mobile */}
          <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center shadow-md relative overflow-hidden flex-shrink-0 p-0.5">
            <img 
              src={logoImage} 
              alt="Divine Naturals Tree Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
              {currentTab.label}
            </h1>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.location.href = '/api/logout'}
          className="flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-64 admin-sidebar border-r 
          transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 border-b">
            <div className="flex items-center space-x-3 mb-2">
              {/* Divine Naturals Tree Icon */}
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden p-1">
                <img 
                  src={logoImage} 
                  alt="Divine Naturals Tree Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Divine Naturals
                </h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-1 lg:space-y-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location === tab.path;
              
              return (
                <Link key={tab.id} href={tab.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 lg:p-3 text-left ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{tab.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 lg:p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground p-3 hover:text-foreground hover:bg-accent/50"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 min-w-0">
          <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            {/* Page Header - Hidden on mobile as it's shown in mobile header */}
            <div className="hidden lg:block mb-4 lg:mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <currentTab.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[hsl(var(--eco-primary))] flex-shrink-0" />
                <h1 className="text-xl lg:text-2xl font-bold text-[hsl(var(--eco-text))] truncate">
                  {currentTab.label}
                </h1>
              </div>
            </div>

            {/* Page Content */}
            <div className="w-full min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}