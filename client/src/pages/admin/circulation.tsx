import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Milk, TrendingUp, MapPin, AlertTriangle, RefreshCw, Calendar, Plus, Search, Filter, Eye, MoreHorizontal, Droplets, Package } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const circulationData = [
  { id: "REG-001", region: "Koramangala", procured: 450, distributed: 425, required: 480, wastage: 15, efficiency: 88.5, coordinator: "Ravi Kumar", phone: "+91 98765 43210", status: "Under-supply" },
  { id: "REG-002", region: "Indiranagar", procured: 380, distributed: 370, required: 390, wastage: 8, efficiency: 94.9, coordinator: "Priya Sharma", phone: "+91 98765 43211", status: "Adequate" },
  { id: "REG-003", region: "Whitefield", procured: 520, distributed: 495, required: 500, wastage: 20, efficiency: 99.0, coordinator: "Suresh Patil", phone: "+91 98765 43212", status: "Adequate" },
  { id: "REG-004", region: "Jayanagar", procured: 340, distributed: 335, required: 350, wastage: 5, efficiency: 95.7, coordinator: "Anjali Reddy", phone: "+91 98765 43213", status: "Adequate" },
  { id: "REG-005", region: "Electronic City", procured: 290, distributed: 280, required: 320, wastage: 8, efficiency: 87.5, coordinator: "Mohan Singh", phone: "+91 98765 43214", status: "Under-supply" },
  { id: "REG-006", region: "BTM Layout", procured: 410, distributed: 395, required: 400, wastage: 12, efficiency: 98.8, coordinator: "Lakshmi Devi", phone: "+91 98765 43215", status: "Adequate" },
];

const weeklyFlowData = [
  { day: 'Mon', procured: 1890, distributed: 1845, required: 1920, wastage: 35 },
  { day: 'Tue', distributed: 1780, required: 1800, procured: 1820, wastage: 28 },
  { day: 'Wed', procured: 1950, distributed: 1890, required: 1960, wastage: 45 },
  { day: 'Thu', procured: 2100, distributed: 2050, required: 2080, wastage: 38 },
  { day: 'Fri', procured: 2230, distributed: 2180, required: 2200, wastage: 42 },
  { day: 'Sat', procured: 2450, distributed: 2395, required: 2420, wastage: 48 },
  { day: 'Sun', procured: 1680, distributed: 1635, required: 1700, wastage: 32 },
];

const hourlyDistributionData = [
  { hour: '6AM', volume: 245, efficiency: 98 },
  { hour: '7AM', volume: 520, efficiency: 95 },
  { hour: '8AM', volume: 680, efficiency: 92 },
  { hour: '9AM', volume: 380, efficiency: 94 },
  { hour: '10AM', volume: 290, efficiency: 96 },
  { hour: '11AM', volume: 180, efficiency: 89 },
  { hour: '12PM', volume: 120, efficiency: 85 },
];

const circulationColumns = [
  {
    accessorKey: 'id',
    header: 'Region ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'region',
    header: 'Region Details',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('region')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {row.original.coordinator}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'flow',
    header: 'Milk Flow (L)',
    cell: ({ row }: any) => (
      <div className="flex flex-col space-y-1">
        <div className="text-xs text-blue-600">
          <Package className="w-3 h-3 inline mr-1" />
          {row.original.procured}L procured
        </div>
        <div className="text-xs text-green-600">
          <Droplets className="w-3 h-3 inline mr-1" />
          {row.original.distributed}L distributed
        </div>
        <div className="text-xs text-orange-600">
          Required: {row.original.required}L
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'efficiency',
    header: 'Efficiency',
    cell: ({ row }: any) => {
      const efficiency = row.getValue('efficiency') as number;
      const color = efficiency >= 95 ? 'text-green-600' : efficiency >= 90 ? 'text-yellow-600' : 'text-red-600';
      return <div className={`text-sm font-medium ${color}`}>{efficiency}%</div>;
    },
  },
  {
    accessorKey: 'wastage',
    header: 'Wastage',
    cell: ({ row }: any) => {
      const wastage = row.getValue('wastage') as number;
      const color = wastage <= 10 ? 'text-green-600' : wastage <= 20 ? 'text-yellow-600' : 'text-red-600';
      return <div className={`text-sm font-medium ${color}`}>{wastage}L</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          className={`${status === 'Adequate' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'} border`}
          data-testid={`status-${status}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          data-testid={`view-region-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`region-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function CirculationPage() {
  const stats = [
    { title: "Total Procured", value: "1,690L", icon: Milk, color: "text-blue-600", bgColor: "bg-blue-50", change: "+5.2%" },
    { title: "Total Distributed", value: "1,625L", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", change: "+3.8%" },
    { title: "Required Today", value: "1,720L", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-50", change: "+2.1%" },
    { title: "Total Wastage", value: "48L", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50", change: "-12.5%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Milk Circulation</h1>
            <p className="text-gray-600 mt-1">Monitor daily milk flow and regional distribution</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="refresh-data">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button className="eco-button" data-testid="update-circulation">
              <Plus className="w-4 h-4 mr-2" />
              Update Flow
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="eco-card stats-card" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} vs yesterday
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flow Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Flow Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="weekly-flow-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Weekly Milk Flow Pattern</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}L`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}L`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="required" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Required"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="procured" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.2}
                    strokeWidth={3}
                    name="Procured"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="distributed" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                    strokeWidth={3}
                    name="Distributed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="hourly-distribution-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Today's Distribution Timeline</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}L`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}L`, 'Volume']}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Volume Distributed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Regional Circulation Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Regional Circulation Status</h3>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none">
                Export
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <DataTable
              columns={circulationColumns}
              data={circulationData}
              searchPlaceholder="Search regions..."
            />
          </div>
        </div>

        {/* Regional Alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="supply-alert">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-red-50 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Supply Shortage</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">2 regions under-supplied</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200 text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="best-performance">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-green-50 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Best Performance</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Whitefield: 99% efficiency</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200 text-xs">
                    Recognize Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1" data-testid="forecast-alert">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-blue-50 flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tomorrow's Forecast</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">1,850L expected demand</p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-200 text-xs">
                    Plan Routes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}