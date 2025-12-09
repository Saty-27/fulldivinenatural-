import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Calendar, Zap, RefreshCw, AlertTriangle, Plus, Search, Filter, Eye, MoreHorizontal, Activity, Target, Clock } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const forecastData = [
  { id: "FC-001", period: "Tomorrow", required: 1720, predicted: 1680, confidence: 95, status: "Shortage", variance: -40, accuracy: "High" },
  { id: "FC-002", period: "Day After", required: 1850, predicted: 1820, confidence: 92, status: "Shortage", variance: -30, accuracy: "High" },
  { id: "FC-003", period: "Next Week", required: 12040, predicted: 11760, confidence: 88, status: "Shortage", variance: -280, accuracy: "Medium" },
  { id: "FC-004", period: "Next Month", required: 48600, predicted: 49200, confidence: 82, status: "Surplus", variance: 600, accuracy: "Medium" },
  { id: "FC-005", period: "Quarter", required: 145800, predicted: 148500, confidence: 78, status: "Surplus", variance: 2700, accuracy: "Low" },
];

const demandTrendData = [
  { day: 'Mon', demand: 1650, supply: 1680, forecast: 1720 },
  { day: 'Tue', demand: 1780, supply: 1750, forecast: 1800 },
  { day: 'Wed', demand: 1920, supply: 1890, forecast: 1950 },
  { day: 'Thu', demand: 2100, supply: 2080, forecast: 2120 },
  { day: 'Fri', demand: 2250, supply: 2200, forecast: 2280 },
  { day: 'Sat', demand: 2450, supply: 2420, forecast: 2480 },
  { day: 'Sun', demand: 1680, supply: 1720, forecast: 1700 },
];

const accuracyData = [
  { week: 'W1', accuracy: 94.5 },
  { week: 'W2', accuracy: 96.2 },
  { week: 'W3', accuracy: 91.8 },
  { week: 'W4', accuracy: 93.7 },
  { week: 'W5', accuracy: 95.1 },
  { week: 'W6', accuracy: 97.3 },
];

const forecastColumns = [
  {
    accessorKey: 'id',
    header: 'Forecast ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'period',
    header: 'Time Period',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('period')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {row.original.accuracy} Accuracy
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'requirements',
    header: 'Demand vs Supply',
    cell: ({ row }: any) => (
      <div className="flex flex-col space-y-1">
        <div className="text-sm">
          <span className="text-orange-600 font-medium">Required: {row.original.required}L</span>
        </div>
        <div className="text-sm">
          <span className="text-blue-600 font-medium">Predicted: {row.original.predicted}L</span>
        </div>
        <div className={`text-xs font-medium ${row.original.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          Variance: {row.original.variance >= 0 ? '+' : ''}{row.original.variance}L
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'confidence',
    header: 'AI Confidence',
    cell: ({ row }: any) => {
      const confidence = row.getValue('confidence') as number;
      const color = confidence >= 90 ? 'text-green-600' : confidence >= 80 ? 'text-yellow-600' : 'text-red-600';
      return <div className={`text-sm font-medium ${color}`}>{confidence}%</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          className={`${status === 'Surplus' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'} border`}
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
          data-testid={`view-forecast-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`forecast-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function RequirementsPage() {
  const stats = [
    { title: "Today's Requirement", value: "1,720L", icon: BarChart3, color: "text-blue-600", bgColor: "bg-blue-50", change: "+3.2%" },
    { title: "Predicted Supply", value: "1,680L", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", change: "+2.8%" },
    { title: "Shortage Alert", value: "40L", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50", change: "+12.5%" },
    { title: "AI Confidence", value: "95%", icon: Zap, color: "text-purple-600", bgColor: "bg-purple-50", change: "+1.2%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirements &amp; Forecast</h1>
            <p className="text-gray-600 mt-1">AI-powered demand prediction and supply planning</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="refresh-forecast">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Model
            </Button>
            <Button className="eco-button" data-testid="update-forecast">
              <Plus className="w-4 h-4 mr-2" />
              Update Forecast
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
                    <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? (stat.title.includes('Shortage') ? 'text-red-600' : 'text-green-600') : 'text-green-600'}`}>
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

        {/* Forecast Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demand vs Supply Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="demand-supply-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">7-Day Demand Forecast</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandTrendData}>
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
                    dataKey="forecast" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    name="Forecast"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.2}
                    strokeWidth={3}
                    name="Actual Demand"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="supply" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                    strokeWidth={3}
                    name="Available Supply"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Model Accuracy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="model-accuracy-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">AI Model Accuracy</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                    domain={[85, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Accuracy']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    name="Model Accuracy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Demand Forecast Analysis</h3>
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
              columns={forecastColumns}
              data={forecastData}
              searchPlaceholder="Search forecasts..."
            />
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="shortage-prediction">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-red-50 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Critical Shortage</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">280L shortfall predicted next week</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200 text-xs">
                    Plan Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="high-accuracy">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-green-50 flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">High Accuracy</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">95% confidence for tomorrow</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200 text-xs">
                    View Model
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1" data-testid="seasonal-trend">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-purple-50 flex-shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Seasonal Trend</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">15% increase expected in winter</p>
                  <Button variant="outline" size="sm" className="mt-2 text-purple-600 border-purple-200 text-xs">
                    Plan Ahead
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