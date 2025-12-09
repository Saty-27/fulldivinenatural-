import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Truck, 
  DollarSign,
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Milk,
  Store,
  CreditCard,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  UserCog,
  MessageSquare,
  Tag,
  Phone,
  Mail,
  Shield,
  Eye,
  CheckCircle,
  FileText,
  User
} from "lucide-react";
import SubAdminLayout from "@/components/layout/sub-admin-layout";
import { useLocation } from "wouter";
import { CalendarWidget } from "@/components/ui/calendar-widget";
import { RevenueChart, OrdersChart, ProductDistributionChart, DeliveryPerformanceChart } from "@/components/charts/sales-charts";
import { DataTable } from "@/components/ui/data-table";
import { RecentActivityWidget } from "@/components/dashboard/recent-activity";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";

export default function SubAdminDashboard() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["/api/vendors"],
    retry: false,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    retry: false,
  });

  const { data: deliveryPartners = [] } = useQuery({
    queryKey: ["/api/delivery-partners"],
    retry: false,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    retry: false,
  });

  const { data: complaints = [] } = useQuery({
    queryKey: ["/api/complaints"],
    retry: false,
  });

  // Helper functions for button actions
  const handleAction = (action: string, item?: any) => {
    toast({
      title: "Action Triggered",
      description: `${action} ${item ? `for ${item.name || item.id || 'item'}` : 'executed successfully'}`,
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    toast({
      title: "Search",
      description: `Searching for: ${term}`,
    });
  };

  // Calculate stats
  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const pendingOrders = Array.isArray(orders) ? orders.filter((o: any) => o.status === 'pending').length : 0;
  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) : 0;
  const activeVendors = Array.isArray(vendors) ? vendors.length : 0;

  // Calculate milk requirements for tomorrow
  const tomorrowMilkRequirement = 2500; // Mock calculation
  const availableCapacity = Array.isArray(vendors) ? vendors.reduce((sum: number, vendor: any) => sum + (vendor.dailyCapacity || 0), 0) : 0;

  // Render content based on current route
  const renderContent = () => {
    switch (location) {
      case '/sub-admin/vendors':
        return <VendorPanelContent vendors={vendors} onAction={handleAction} />;
      case '/sub-admin/subvendors':
        return <SubvendorsContent onAction={handleAction} />;
      case '/sub-admin/delivery':
        return <DeliveryPartnersContent deliveryPartners={deliveryPartners} onAction={handleAction} />;
      case '/sub-admin/customers':
        return <CustomersContent customers={customers} onAction={handleAction} onSearch={handleSearch} />;
      case '/sub-admin/circulation':
        return <MilkCirculationContent onAction={handleAction} />;
      case '/sub-admin/finance':
        return <RevenueFinanceContent orders={orders} onAction={handleAction} />;
      case '/sub-admin/requirements':
        return <RequirementsForecastContent onAction={handleAction} />;
      case '/sub-admin/complaints':
        return <ComplaintsSupportContent complaints={complaints} onAction={handleAction} />;
      case '/sub-admin/reports':
        return <ReportsAnalyticsContent />;
      case '/sub-admin/inventory':
        return <InventoryManagementContent onAction={handleAction} />;
      case '/sub-admin/invoices':
        return <InvoicesPaymentsContent onAction={handleAction} />;
      case '/sub-admin/employees':
        return <EmployeeManagementContent onAction={handleAction} />;
      case '/sub-admin/roles':
        return <RolePermissionsContent onAction={handleAction} />;
      case '/sub-admin/settings':
        return <SettingsConfigContent onAction={handleAction} />;
      case '/sub-admin/banking':
        return <BankAccountsFinanceContent onAction={handleAction} />;
      case '/sub-admin/audit':
        return <AuditLogsContent onAction={handleAction} />;
      case '/sub-admin/marketing':
        return <MarketingCampaignsContent onAction={handleAction} />;
      case '/sub-admin/loyalty':
        return <LoyaltyProgramsContent onAction={handleAction} />;
      case '/sub-admin/monitoring':
        return <SystemHealthContent onAction={handleAction} />;
      default:
        return <DashboardOverviewContent 
          tomorrowMilkRequirement={tomorrowMilkRequirement}
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          totalRevenue={totalRevenue}
          availableCapacity={availableCapacity}
          vendors={vendors}
          deliveryPartners={deliveryPartners}
          customers={customers}
          orders={orders}
        />;
    }
  };

  return (
    <SubAdminLayout>
      {location === '/sub-admin' || location === '/sub-admin/dashboard' ? (
        <>
          {/* Welcome Header */}
          <div className="welcome-header p-3 sm:p-4 lg:p-6 mb-4 lg:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="dairy-title text-xl sm:text-2xl mb-2 truncate">
                  Welcome Back, Sub-Admin 👋
                </h1>
                <div className="dairy-muted flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-4">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{formattedTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="notification-badge relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          {renderContent()}
        </>
      ) : (
        renderContent()
      )}
    </SubAdminLayout>
  );
}

// Enhanced Dashboard Overview Content with Comprehensive Analytics
function DashboardOverviewContent({ tomorrowMilkRequirement, totalOrders, pendingOrders, totalRevenue, availableCapacity, vendors, deliveryPartners, customers, orders }: any) {
  const totalVendors = Array.isArray(vendors) ? vendors.length : 0;
  const totalDeliveryPartners = Array.isArray(deliveryPartners) ? deliveryPartners.length : 0;
  const totalCustomers = Array.isArray(customers) ? customers.length : 0;
  const activeDeliveryPartners = Array.isArray(deliveryPartners) ? deliveryPartners.filter((p: any) => p.isActive).length : 0;
  
  return (
    <>
      {/* Enhanced KPI Overview - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-6" style={{animationDelay: '0.2s'}}>
        <StatsCard
          title="Total Vendors"
          value={totalVendors.toString()}
          icon={<Store className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="Across all zones"
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Subvendors"
          value="48"
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="Branch network"
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="Delivery Partners"
          value={totalDeliveryPartners.toString()}
          icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend={`${activeDeliveryPartners} active today`}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatsCard
          title="Total Customers"
          value={totalCustomers.toString()}
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="+15 this week"
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Enhanced KPI Overview - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-6" style={{animationDelay: '0.4s'}}>
        <StatsCard
          title="Today's Milk Circulation"
          value="4,250L"
          icon={<Milk className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend={`Target: ${tomorrowMilkRequirement}L`}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Today's Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="+12% vs yesterday"
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="Weekly Revenue"
          value="₹8,45,000"
          icon={<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="+8% vs last week"
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatsCard
          title="Monthly Revenue"
          value="₹34,50,000"
          icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="+18% vs last month"
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <RevenueChart />
        <OrdersChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <ProductDistributionChart />
        <DeliveryPerformanceChart />
      </div>

      {/* Quick Actions */}
      <Card className="eco-card mb-6 lg:mb-8">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="dairy-title text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button className="eco-button h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 group">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-bounce" />
              <div className="text-center">
                <span className="dairy-body block mb-1 text-sm sm:text-base">Alert All Vendors</span>
                <span className="text-xs opacity-90">Send capacity alerts</span>
              </div>
            </Button>
            <Button className="eco-button-secondary h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 group">
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="dairy-body block mb-1 text-sm sm:text-base">Send Bill Reminders</span>
                <span className="text-xs opacity-75">12 pending payments</span>
              </div>
            </Button>
            <Button className="eco-button-secondary h-auto p-4 sm:p-6 flex flex-col items-center space-y-2 sm:space-y-3 group sm:col-span-2 lg:col-span-1">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform" />
              <div className="text-center">
                <span className="dairy-body block mb-1 text-sm sm:text-base">Assign Deliveries</span>
                <span className="text-xs opacity-75">Auto-distribute orders</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="lg:col-span-2 min-w-0">
          <CalendarWidget />
        </div>
        <div className="min-w-0">
          <RecentActivityWidget orders={orders} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable orders={orders} />
    </>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, trend, color, bgColor }: any) {
  return (
    <Card className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className={`text-2xl sm:text-3xl font-bold ${color} truncate`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{trend}</p>
          </div>
          <div className={`${color} ${bgColor} p-2 sm:p-3 rounded-full flex-shrink-0`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder content components
function VendorPanelContent({ vendors, onAction }: any) {
  return <div>Vendor Panel Content - Sub Admin</div>;
}

function SubvendorsContent({ onAction }: any) {
  return <div>Subvendors Content - Sub Admin</div>;
}

function DeliveryPartnersContent({ deliveryPartners, onAction }: any) {
  return <div>Delivery Partners Content - Sub Admin</div>;
}

function CustomersContent({ customers, onAction, onSearch }: any) {
  return <div>Customers Content - Sub Admin</div>;
}

function MilkCirculationContent({ onAction }: any) {
  return <div>Milk Circulation Content - Sub Admin</div>;
}

function RevenueFinanceContent({ orders, onAction }: any) {
  return <div>Revenue Finance Content - Sub Admin</div>;
}

function RequirementsForecastContent({ onAction }: any) {
  return <div>Requirements Forecast Content - Sub Admin</div>;
}

function ComplaintsSupportContent({ complaints, onAction }: any) {
  return <div>Complaints Support Content - Sub Admin</div>;
}

function ReportsAnalyticsContent() {
  return <div>Reports Analytics Content - Sub Admin</div>;
}

function InventoryManagementContent({ onAction }: any) {
  return <div>Inventory Management Content - Sub Admin</div>;
}

function InvoicesPaymentsContent({ onAction }: any) {
  return <div>Invoices Payments Content - Sub Admin</div>;
}

function EmployeeManagementContent({ onAction }: any) {
  return <div>Employee Management Content - Sub Admin</div>;
}

function RolePermissionsContent({ onAction }: any) {
  return <div>Role Permissions Content - Sub Admin</div>;
}

function SettingsConfigContent({ onAction }: any) {
  return <div>Settings Config Content - Sub Admin</div>;
}

function BankAccountsFinanceContent({ onAction }: any) {
  return <div>Bank Accounts Finance Content - Sub Admin</div>;
}

function AuditLogsContent({ onAction }: any) {
  return <div>Audit Logs Content - Sub Admin</div>;
}

function MarketingCampaignsContent({ onAction }: any) {
  return <div>Marketing Campaigns Content - Sub Admin</div>;
}

function LoyaltyProgramsContent({ onAction }: any) {
  return <div>Loyalty Programs Content - Sub Admin</div>;
}

function SystemHealthContent({ onAction }: any) {
  return <div>System Health Content - Sub Admin</div>;
}