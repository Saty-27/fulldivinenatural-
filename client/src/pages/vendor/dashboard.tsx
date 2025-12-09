import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Milk, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Info,
  Plus,
  LogOut,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Phone
} from "lucide-react";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InwardEntryModal from "@/components/vendor/InwardEntryModal";

export default function VendorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vendor dashboard data according to new API specification
  const { data: vendorDashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/vendor/me/dashboard"],
    retry: false,
  });

  const { data: inwardLogs } = useQuery({
    queryKey: ["/api/vendor/inward"],
    retry: false,
  });

  const { data: drivers } = useQuery({
    queryKey: ["/api/vendor/drivers"],
    retry: false,
  });

  // KPI data from dashboard API with proper typing
  const kpiData = (vendorDashboard as any) || {
    requirementToday: 0,
    circulatedLiters: 0,
    paymentsPending: 0,
    revenueToday: 0,
    requirementTomorrow: 0,
    businessName: "Loading...",
    locationName: "Loading..."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 animate-fade-in">
      {/* Enhanced Header */}
      <div className="eco-header px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-7xl mx-auto gap-4">
          <div className="flex items-center space-x-3 sm:space-x-6 min-w-0 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden flex-shrink-0 p-3">
              <img 
                src={logoImage} 
                alt="Divine Naturals Tree Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                Divine Naturals
              </h1>
              <div className="text-sm sm:text-base lg:text-lg text-[hsl(var(--eco-text-muted))] font-semibold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <div className="flex items-center">
                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse flex-shrink-0"></span>
                  <span className="truncate">📍 {kpiData?.locationName || "Location"}</span>
                </div>
                <span className="hidden sm:inline sm:mx-2">•</span>
                <span className="text-xs sm:text-sm lg:text-base">Vendor Dashboard</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => window.location.href = "/auth/login"}
            className="eco-button-outline flex-shrink-0 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8 lg:space-y-12 max-w-7xl mx-auto">
        {/* Enhanced KPI Cards Section */}
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center space-x-3 sm:space-x-4 bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-lg">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 eco-icon-primary flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[hsl(var(--eco-secondary))] truncate">Divine Naturals Performance</h2>
            </div>
            <p className="text-base sm:text-lg text-[hsl(var(--eco-text-muted))] font-medium px-4">Real-time insights into your daily operations</p>
          </div>
          
          <TooltipProvider>
            <div className="dashboard-grid">
              
              {/* Requirement Today */}
              <Card className="kpi-card group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-[hsl(var(--eco-text-muted))] flex items-center justify-between">
                    📋 Requirement Today
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-5 h-5 eco-icon-primary hover:scale-110 transition-transform" />
                      </TooltipTrigger>
                      <TooltipContent className="eco-tooltip">
                        <p>Total milk requirement assigned for today by admin</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-5xl font-black text-[hsl(var(--eco-secondary))] mb-3">
                    {kpiData?.requirementToday || 0}<span className="text-2xl text-[hsl(var(--eco-primary))]">L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                      <Calendar className="w-5 h-5 mr-2 eco-icon-accent" />
                      Today's target
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Circulated Liters */}
              <Card className="kpi-card group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-[hsl(var(--eco-text-muted))] flex items-center justify-between">
                    🚚 Circulated Liters
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-5 h-5 eco-icon-primary hover:scale-110 transition-transform" />
                      </TooltipTrigger>
                      <TooltipContent className="eco-tooltip">
                        <p>Total milk delivered vs requirement today</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-5xl font-black text-[hsl(var(--eco-success))] mb-3">
                    {kpiData?.circulatedLiters || 0}<span className="text-2xl text-[hsl(var(--eco-primary))]">L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                      <TrendingUp className="w-5 h-5 mr-2 eco-icon-primary" />
                      Delivered today
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payments Due */}
              <Card className="kpi-card group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-[hsl(var(--eco-text-muted))] flex items-center justify-between">
                    💰 Payments Due
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-5 h-5 eco-icon-primary hover:scale-110 transition-transform" />
                      </TooltipTrigger>
                      <TooltipContent className="eco-tooltip">
                        <p>Outstanding payments pending from customers</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-5xl font-black text-[hsl(var(--eco-error))] mb-3">
                    ₹{kpiData?.paymentsPending || 0}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                      <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                      Pending collection
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Today */}
              <Card className="kpi-card group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-[hsl(var(--eco-text-muted))] flex items-center justify-between">
                    💵 Revenue Today
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-5 h-5 eco-icon-primary hover:scale-110 transition-transform" />
                      </TooltipTrigger>
                      <TooltipContent className="eco-tooltip">
                        <p>Total revenue earned today from deliveries</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-5xl font-black text-[hsl(var(--eco-success))] mb-3">
                    ₹{kpiData?.revenueToday || 0}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                      <TrendingUp className="w-5 h-5 mr-2 eco-icon-primary" />
                      Today's earnings
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Day Forecast */}
              <Card className="kpi-card group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-[hsl(var(--eco-text-muted))] flex items-center justify-between">
                    🔮 Next Day Forecast
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-5 h-5 eco-icon-primary hover:scale-110 transition-transform" />
                      </TooltipTrigger>
                      <TooltipContent className="eco-tooltip">
                        <p>Estimated requirement for tomorrow based on subscriptions and orders</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-5xl font-black text-[hsl(var(--eco-primary))] mb-3">
                    {kpiData?.requirementTomorrow || 0}<span className="text-2xl text-purple-600">L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                      Tomorrow's forecast
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TooltipProvider>
        </div>

        {/* Enhanced Main Content Tabs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-blue-100">
          <Tabs defaultValue="inward" className="w-full">
            {/* Amazing Tab Navigation */}
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 border-white shadow-inner mb-6 sm:mb-8 gap-2 sm:gap-0">
              <TabsTrigger 
                value="inward" 
                className="relative overflow-hidden rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-inward"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl">📋</span>
                  <span className="truncate">Inward Logs</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="drivers" 
                className="relative overflow-hidden rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-drivers"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl">👥</span>
                  <span className="truncate">Drivers</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="relative overflow-hidden rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-green-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-reports"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl">📊</span>
                  <span className="truncate">Reports</span>
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Inward Logs Tab */}
            <TabsContent value="inward" className="space-y-8">
              {/* Amazing Section Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-cyan-500/90"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="text-white">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl">📋</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black mb-2">Inward Entry Records</h3>
                        <p className="text-blue-100 text-lg font-semibold">Submit and track your daily milk delivery reports</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-blue-100">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Real-time Tracking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold">Daily Reports</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                    <InwardEntryModal
                      trigger={
                        <Button className="relative bg-white text-blue-600 hover:bg-blue-50 border-0 rounded-2xl px-8 py-4 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" data-testid="button-add-inward">
                          <Plus className="w-6 h-6 mr-3" />
                          Add Inward Entry
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>

            <Card className="eco-card">
              <CardContent className="p-8">
                {!inwardLogs || (Array.isArray(inwardLogs) && inwardLogs.length === 0) ? (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Milk className="w-16 h-16 text-[hsl(var(--eco-primary))]" />
                    </div>
                    <h4 className="text-2xl font-black text-[hsl(var(--eco-secondary))] mb-3">No inward entries yet</h4>
                    <p className="text-[hsl(var(--eco-text-muted))] mb-8 text-lg">Start tracking your daily milk deliveries with detailed reports</p>
                    <InwardEntryModal
                      trigger={
                        <Button className="eco-button-secondary">
                          <Plus className="w-5 h-5 mr-2" />
                          Create First Entry
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Array.isArray(inwardLogs) && inwardLogs.slice(0, 5).map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-8 bg-gradient-to-r from-white to-blue-50 rounded-3xl border-2 border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center space-x-8">
                          <div className={`w-6 h-6 rounded-full shadow-lg ${
                            log.status === 'APPROVED' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            log.status === 'REJECTED' ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          }`} />
                          <div>
                            <div className="font-black text-[hsl(var(--eco-secondary))] text-xl mb-2">
                              🥛 {log.litersArrived}L arrived • ✅ {log.litersDelivered}L delivered
                            </div>
                            <div className="text-[hsl(var(--eco-text-muted))] flex items-center font-semibold">
                              <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                              {new Date(log.createdAt).toLocaleDateString('en-IN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge className={`px-6 py-3 text-base font-black rounded-full ${
                          log.status === 'APPROVED' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                          log.status === 'REJECTED' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        }`}>
                          {log.status === 'APPROVED' ? '✅ Approved' :
                           log.status === 'REJECTED' ? '❌ Rejected' : '⏳ Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

            {/* Enhanced Drivers Tab */}
            <TabsContent value="drivers" className="space-y-8">
              {/* Amazing Section Header for Drivers */}
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-indigo-500/90"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="text-white">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl">👥</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black mb-2">Driver Management</h3>
                        <p className="text-purple-100 text-lg font-semibold">Manage your delivery team and KYC documents</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-purple-100">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">Team Management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">KYC Verification</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                    <Button className="relative bg-white text-purple-600 hover:bg-purple-50 border-0 rounded-2xl px-8 py-4 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" data-testid="button-add-driver">
                      <Plus className="w-6 h-6 mr-3" />
                      Add Driver
                    </Button>
                  </div>
                </div>
              </div>

            <Card className="eco-card">
              <CardContent className="p-8">
                {!drivers || (Array.isArray(drivers) && drivers.length === 0) ? (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Users className="w-16 h-16 text-[hsl(var(--eco-primary))]" />
                    </div>
                    <h4 className="text-2xl font-black text-[hsl(var(--eco-secondary))] mb-3">No drivers registered</h4>
                    <p className="text-[hsl(var(--eco-text-muted))] mb-8 text-lg">Build your delivery team with complete KYC documentation</p>
                    <Button className="eco-button-secondary">
                      <Plus className="w-5 h-5 mr-2" />
                      Add First Driver
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Array.isArray(drivers) && drivers.map((driver: any) => (
                      <div key={driver.id} className="flex items-center justify-between p-8 bg-gradient-to-r from-white to-purple-50 rounded-3xl border-2 border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center space-x-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center">
                            <Users className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <div className="font-black text-[hsl(var(--eco-secondary))] text-xl mb-2">👤 {driver.name}</div>
                            <div className="text-[hsl(var(--eco-text-muted))] flex items-center space-x-6 font-semibold">
                              <span className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                                Age: {driver.age}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-blue-500" />
                                {driver.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {driver.aadharUrl && (
                            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 text-sm font-bold">📄 Aadhar</Badge>
                          )}
                          {driver.panUrl && (
                            <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 text-sm font-bold">📄 PAN</Badge>
                          )}
                          {!driver.aadharUrl && !driver.panUrl && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-4 py-2 text-sm font-bold">⚠️ KYC Pending</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

            {/* Enhanced Reports Tab */}
            <TabsContent value="reports" className="space-y-8">
              {/* Amazing Section Header for Reports */}
              <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-emerald-500/90"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="text-white">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl">📊</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black mb-2">Performance Reports</h3>
                        <p className="text-green-100 text-lg font-semibold">Track your performance metrics and analytics</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-green-100">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">Performance Analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-semibold">Revenue Insights</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                    <Button className="relative bg-white text-green-600 hover:bg-green-50 border-0 rounded-2xl px-8 py-4 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <TrendingUp className="w-6 h-6 mr-3" />
                      Export Reports
                    </Button>
                  </div>
                </div>
              </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="eco-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <TrendingUp className="w-6 h-6 mr-3 eco-icon-primary" />
                    📈 Weekly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                      <span className="text-[hsl(var(--eco-text-muted))] font-bold text-lg">💰 Total Revenue</span>
                      <span className="font-black text-[hsl(var(--eco-success))] text-2xl">₹{(kpiData?.revenueToday || 0) * 7}</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                      <span className="text-[hsl(var(--eco-text-muted))] font-bold text-lg">🥛 Avg Daily Supply</span>
                      <span className="font-black text-[hsl(var(--eco-primary))] text-2xl">{Math.round((kpiData?.circulatedLiters || 0) * 0.8)}L</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                      <span className="text-[hsl(var(--eco-text-muted))] font-bold text-lg">📊 Fulfillment Rate</span>
                      <span className="font-black text-[hsl(var(--eco-success))] text-2xl">
                        {(kpiData?.requirementToday || 0) > 0 ? Math.round(((kpiData?.circulatedLiters || 0) / (kpiData?.requirementToday || 1)) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="eco-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <CheckCircle className="w-6 h-6 mr-3 eco-icon-primary" />
                    ⚡ Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="eco-button w-full justify-start h-16 text-lg font-bold" data-testid="button-set-requirement">
                    <Clock className="w-6 h-6 mr-4" />
                    ⏰ Set Daily Requirement
                  </Button>
                  <Button className="eco-button-secondary w-full justify-start h-16 text-lg font-bold" data-testid="button-notify-admin">
                    <AlertCircle className="w-6 h-6 mr-4" />
                    📢 Notify Admin
                  </Button>
                  <Button className="eco-button-outline w-full justify-start h-16 text-lg font-bold" data-testid="button-view-analytics">
                    <TrendingUp className="w-6 h-6 mr-4" />
                    📊 View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}