import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Milk, Package, Users, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function SubVendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-green-100 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
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
                <p className="text-[hsl(var(--eco-text-muted))] text-base sm:text-lg font-semibold">
                  Sub-Vendor Dashboard • Branch Operations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="hidden sm:block w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold hidden sm:block">
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/80 backdrop-blur-sm border border-green-100 rounded-2xl p-2 shadow-lg gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-green-50 transition-all duration-300 rounded-xl font-bold text-sm sm:text-base">
              <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="requirements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-amber-50 transition-all duration-300 rounded-xl font-bold text-sm sm:text-base">
              <Package className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Requirements</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50 transition-all duration-300 rounded-xl font-bold text-sm sm:text-base">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-purple-50 transition-all duration-300 rounded-xl font-bold text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <Milk className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Today's Requirement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">
                      500L
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Daily target
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Stock Available</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-green-600 mb-2">
                      350L
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Ready for delivery
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Delivery Partners</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-purple-600 mb-2">
                      3
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Active drivers
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Today's Revenue</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-amber-600 mb-2">
                      ₹15,750
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Net earnings
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-8">
            <Card className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  Requirement Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">
                    Requirement Management
                  </p>
                  <p className="text-[hsl(var(--eco-text-muted))] font-semibold mb-8 max-w-md mx-auto">
                    Track daily milk requirements and optimize supply chain management
                  </p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Package className="w-5 h-5 mr-2" />
                    Add Today's Requirement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-8">
            <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Delivery Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">
                    Partner Network
                  </p>
                  <p className="text-[hsl(var(--eco-text-muted))] font-semibold mb-8 max-w-md mx-auto">
                    Manage and coordinate with your delivery partners for efficient operations
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Users className="w-5 h-5 mr-2" />
                    Add Delivery Partner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">
                    Advanced Analytics
                  </p>
                  <p className="text-[hsl(var(--eco-text-muted))] font-semibold mb-8 max-w-md mx-auto">
                    Comprehensive performance metrics, trends analysis, and business insights coming soon
                  </p>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 max-w-sm mx-auto">
                    <p className="text-purple-600 font-semibold text-sm">
                      🚀 Enhanced analytics dashboard in development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}