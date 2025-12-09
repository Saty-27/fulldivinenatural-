import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  PlusCircle,
  Eye,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Milk,
  User,
  LogOut,
  Building,
  Target,
  Activity,
  AlertTriangle
} from "lucide-react";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function VendorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vendor dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/vendor/me/dashboard"],
    retry: false,
  });

  const { data: subVendors } = useQuery({
    queryKey: ["/api/vendor/sub-vendors"],
    retry: false,
  });

  const { data: dailyPerformance } = useQuery({
    queryKey: ["/api/vendor/daily-performance"],
    retry: false,
  });

  const { data: financialData } = useQuery({
    queryKey: ["/api/vendor/financial-analytics"],
    retry: false,
  });

  const { data: deliveryAssignments } = useQuery({
    queryKey: ["/api/vendor/delivery-assignments"],
    retry: false,
  });

  const kpiData = dashboardData || {
    businessName: "Loading...",
    locationName: "Loading...",
    requirementToday: 0,
    circulatedLiters: 0,
    revenueToday: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    paymentsPending: 0,
    subVendorStats: {
      subVendorCount: 0,
      subVendorRequirement: 0,
      subVendorCirculated: 0,
      subVendorRevenue: 0
    }
  };

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Loading Vendor Dashboard...</p>
        </div>
      </div>
    );
  }

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
                  <span className="truncate">📍 {(kpiData as any)?.locationName || "Location"}</span>
                </div>
                <span className="hidden sm:inline sm:mx-2">•</span>
                <span className="text-xs sm:text-sm lg:text-base">Main Vendor Portal</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => window.location.href = "/"}
            className="eco-button-outline flex-shrink-0 w-full sm:w-auto"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8 lg:space-y-12 max-w-7xl mx-auto">
        {/* Enhanced KPI Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <Card className="eco-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 eco-icon-primary flex-shrink-0" />
                <span className="truncate">🎯 Consolidated Requirement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[hsl(var(--eco-primary))] mb-2">
                {((kpiData as any)?.requirementToday || 0) + ((kpiData as any)?.subVendorStats?.subVendorRequirement || 0)}
                <span className="text-lg sm:text-xl text-blue-600">L</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600 flex-shrink-0" />
                <span className="truncate">Self + Sub-vendors</span>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 eco-icon-success flex-shrink-0" />
                <span className="truncate">🥛 Total Circulated</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[hsl(var(--eco-success))] mb-2">
                {((kpiData as any)?.circulatedLiters || 0) + ((kpiData as any)?.subVendorStats?.subVendorCirculated || 0)}
                <span className="text-lg sm:text-xl text-green-600">L</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600 flex-shrink-0" />
                <span className="truncate">Area-wide delivery</span>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-lg font-black">
                <DollarSign className="w-6 h-6 mr-3 eco-icon-accent" />
                💰 Area Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-[hsl(var(--eco-accent))] mb-2">
                ₹{(((kpiData as any)?.revenueToday || 0) + ((kpiData as any)?.subVendorStats?.subVendorRevenue || 0)).toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                <TrendingUp className="w-4 h-4 mr-2 text-yellow-600" />
                Combined earnings
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-lg font-black">
                <Users className="w-6 h-6 mr-3 eco-icon-secondary" />
                👥 Sub-Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-[hsl(var(--eco-secondary))] mb-2">
                {(kpiData as any)?.subVendorStats?.subVendorCount || 0}
              </div>
              <div className="flex items-center text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                <Building className="w-4 h-4 mr-2 text-purple-600" />
                Active sub-vendors
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="eco-card border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader className="pb-6">
            <CardTitle className="text-[hsl(var(--eco-warning))] flex items-center text-xl font-black">
              <AlertTriangle className="w-6 h-6 mr-3" />
              ⚠️ Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[hsl(var(--eco-secondary))]">Low Delivery</div>
                    <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Sub-Vendor 2 below 90%</div>
                  </div>
                  <Badge className="bg-orange-500 text-white px-3 py-1 font-bold">WARNING</Badge>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[hsl(var(--eco-secondary))]">Payment Pending</div>
                    <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">₹2,500 from Sub-Vendor 1</div>
                  </div>
                  <Badge className="bg-red-500 text-white px-3 py-1 font-bold">URGENT</Badge>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[hsl(var(--eco-secondary))]">KYC Missing</div>
                    <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">3 delivery partners</div>
                  </div>
                  <Badge className="bg-yellow-500 text-white px-3 py-1 font-bold">INFO</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100">
          <Tabs defaultValue="sub-vendors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 p-3 rounded-2xl border-2 border-white shadow-inner mb-8">
              <TabsTrigger 
                value="sub-vendors" 
                className="relative overflow-hidden rounded-xl px-6 py-4 text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-sub-vendors"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-3 text-xl">👥</span>
                  Sub-Vendors
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="relative overflow-hidden rounded-xl px-6 py-4 text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-performance"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-3 text-xl">📊</span>
                  Performance
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="delivery" 
                className="relative overflow-hidden rounded-xl px-6 py-4 text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-green-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-delivery"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-3 text-xl">🚛</span>
                  Delivery
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="financial" 
                className="relative overflow-hidden rounded-xl px-6 py-4 text-lg font-black transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-orange-600 data-[state=inactive]:hover:scale-102" 
                data-testid="tab-financial"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-3 text-xl">💰</span>
                  Financial
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Sub-Vendors Tab */}
            <TabsContent value="sub-vendors" className="space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[hsl(var(--eco-secondary))]">Sub-Vendor Monitoring</h3>
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg font-bold">
                    {(subVendors as any)?.length || 0} Active Sub-Vendors
                  </Badge>
                </div>
                
                {(subVendors as any)?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(subVendors as any).map((subVendor: any) => (
                      <Card key={subVendor.id} className="eco-card hover:shadow-xl transition-shadow">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Building className="w-6 h-6 mr-3 text-purple-600" />
                              <div>
                                <div className="text-xl font-black text-[hsl(var(--eco-secondary))]">
                                  {subVendor.businessName}
                                </div>
                                <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                                  📍 {subVendor.locationName}
                                </div>
                              </div>
                            </div>
                            <Badge className={`${subVendor.fulfillmentRate > 95 ? 'bg-green-500' : subVendor.fulfillmentRate > 90 ? 'bg-yellow-500' : 'bg-red-500'} text-white px-3 py-1 font-bold`}>
                              {subVendor.fulfillmentRate}%
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-xl">
                              <div className="text-2xl font-black text-[hsl(var(--eco-primary))]">
                                {subVendor.requirementToday}L
                              </div>
                              <div className="text-sm font-semibold text-[hsl(var(--eco-text-muted))]">
                                Requirement
                              </div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-xl">
                              <div className="text-2xl font-black text-[hsl(var(--eco-success))]">
                                {subVendor.circulatedLiters}L
                              </div>
                              <div className="text-sm font-semibold text-[hsl(var(--eco-text-muted))]">
                                Circulated
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-center">
                            <div className="text-2xl font-black text-[hsl(var(--eco-accent))]">
                              ₹{subVendor.revenueToday.toLocaleString()}
                            </div>
                            <div className="text-sm font-semibold text-[hsl(var(--eco-text-muted))]">
                              Today's Revenue
                            </div>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <Button className="eco-button-outline" data-testid={`button-view-details-${subVendor.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-500 mb-4">No sub-vendors found</p>
                    <p className="text-[hsl(var(--eco-text-muted))] font-semibold">
                      Sub-vendors will appear here once assigned to your area
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="eco-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                      <BarChart3 className="w-6 h-6 mr-3 eco-icon-primary" />
                      📊 Area Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(dailyPerformance as any)?.slice(0, 3).map((day: any, index: number) => (
                        <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg text-[hsl(var(--eco-secondary))]">
                              {new Date(day.date).toLocaleDateString()}
                            </span>
                            <Badge className={`${day.fulfillmentRate > 95 ? 'bg-green-500' : day.fulfillmentRate > 90 ? 'bg-yellow-500' : 'bg-red-500'} text-white px-3 py-1 font-bold`}>
                              {day.fulfillmentRate}% Area Rate
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-black text-[hsl(var(--eco-primary))]">{day.requirementSet}L</div>
                              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Required</div>
                            </div>
                            <div>
                              <div className="text-2xl font-black text-[hsl(var(--eco-success))]">{day.milkCirculated}L</div>
                              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Circulated</div>
                            </div>
                            <div>
                              <div className="text-2xl font-black text-[hsl(var(--eco-accent))]">₹{day.totalEarnings.toLocaleString()}</div>
                              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Revenue</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="eco-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                      <Target className="w-6 h-6 mr-3 eco-icon-accent" />
                      🎯 Forecasting & Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-xl bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="text-lg font-bold text-[hsl(var(--eco-secondary))] mb-2">Tomorrow's Forecast</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-black text-[hsl(var(--eco-primary))]">520L</div>
                            <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Expected Demand</div>
                          </div>
                          <div>
                            <div className="text-2xl font-black text-[hsl(var(--eco-success))]">95%</div>
                            <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Confidence</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="text-lg font-bold text-[hsl(var(--eco-secondary))] mb-2">Weekly Target</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-black text-[hsl(var(--eco-primary))]">3,500L</div>
                            <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Weekly Goal</div>
                          </div>
                          <div>
                            <div className="text-2xl font-black text-[hsl(var(--eco-success))]">82%</div>
                            <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Progress</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Delivery Management Tab */}
            <TabsContent value="delivery" className="space-y-8">
              <Card className="eco-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <Activity className="w-6 h-6 mr-3 eco-icon-primary" />
                    🚛 Delivery Partner Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-[hsl(var(--eco-secondary))]">Active Assignments</h4>
                      {(deliveryAssignments as any)?.slice(0, 3).map((assignment: any, index: number) => (
                        <div key={index} className="p-4 border rounded-xl bg-gradient-to-r from-green-50 to-blue-50">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-bold text-[hsl(var(--eco-secondary))]">
                              {assignment.deliveryPartner.name}
                            </div>
                            <Badge className={`${assignment.deliveryStatus === 'COMPLETED' ? 'bg-green-500' : assignment.deliveryStatus === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-orange-500'} text-white px-3 py-1 font-bold`}>
                              {assignment.deliveryStatus}
                            </Badge>
                          </div>
                          <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                            📱 {assignment.deliveryPartner.phone}
                          </div>
                          <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                            📍 {assignment.route}
                          </div>
                          <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                            🥛 {assignment.assignedLiters}L assigned
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-[hsl(var(--eco-secondary))]">KYC Status Overview</h4>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-black text-green-600">8</div>
                            <div className="text-sm font-semibold text-gray-600">KYC Complete</div>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-black text-orange-600">3</div>
                            <div className="text-sm font-semibold text-gray-600">KYC Pending</div>
                          </div>
                          <AlertCircle className="w-8 h-8 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Summary Tab */}
            <TabsContent value="financial" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="eco-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                      <DollarSign className="w-6 h-6 mr-3 eco-icon-accent" />
                      💰 Vendor Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-black text-[hsl(var(--eco-accent))] mb-1">
                          ₹{(kpiData as any)?.revenueToday?.toLocaleString() || 0}
                        </div>
                        <div className="text-[hsl(var(--eco-text-muted))] font-semibold">Today's Earnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-[hsl(var(--eco-success))]">
                          ₹{(kpiData as any)?.weeklyEarnings?.toLocaleString() || 0}
                        </div>
                        <div className="text-[hsl(var(--eco-text-muted))] font-semibold">Weekly Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="eco-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                      <Building className="w-6 h-6 mr-3 eco-icon-secondary" />
                      🏢 Sub-Vendor Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-black text-[hsl(var(--eco-secondary))] mb-1">
                          ₹{((kpiData as any)?.subVendorStats?.subVendorRevenue || 0).toLocaleString()}
                        </div>
                        <div className="text-[hsl(var(--eco-text-muted))] font-semibold">Combined Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-[hsl(var(--eco-primary))]">
                          {(kpiData as any)?.subVendorStats?.subVendorCount || 0}
                        </div>
                        <div className="text-[hsl(var(--eco-text-muted))] font-semibold">Active Sub-Vendors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="eco-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                      <AlertCircle className="w-6 h-6 mr-3 eco-icon-warning" />
                      ⚠️ Payments Pending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-orange-50 rounded-xl text-center">
                        <div className="text-2xl font-black text-[hsl(var(--eco-warning))]">
                          ₹2,500
                        </div>
                        <div className="text-sm font-semibold text-[hsl(var(--eco-text-muted))]">
                          From Sub-Vendor 1
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-xl text-center">
                        <div className="text-2xl font-black text-[hsl(var(--eco-warning))]">
                          ₹750
                        </div>
                        <div className="text-sm font-semibold text-[hsl(var(--eco-text-muted))]">
                          From Sub-Vendor 2
                        </div>
                      </div>
                    </div>
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