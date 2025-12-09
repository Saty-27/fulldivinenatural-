import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, Calendar, TrendingUp, PieChart, Plus, Search, Filter, Eye, MoreHorizontal, Clock, Database, Share } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const reportsData = [
  { id: "RPT-001", name: "Daily Sales Report", type: "Sales", category: "Financial", lastGenerated: "2025-08-22", status: "Ready", size: "2.4 MB", frequency: "Daily", nextRun: "2025-08-23", createdBy: "System" },
  { id: "RPT-002", name: "Vendor Performance Analysis", type: "Vendor", category: "Operations", lastGenerated: "2025-08-21", status: "Generating", size: "1.8 MB", frequency: "Weekly", nextRun: "2025-08-28", createdBy: "Admin" },
  { id: "RPT-003", name: "Delivery Efficiency Report", type: "Delivery", category: "Logistics", lastGenerated: "2025-08-20", status: "Ready", size: "3.2 MB", frequency: "Daily", nextRun: "2025-08-23", createdBy: "Manager" },
  { id: "RPT-004", name: "Customer Analytics Dashboard", type: "Customer", category: "Marketing", lastGenerated: "2025-08-19", status: "Ready", size: "2.1 MB", frequency: "Weekly", nextRun: "2025-08-26", createdBy: "System" },
  { id: "RPT-005", name: "Financial Summary", type: "Financial", category: "Financial", lastGenerated: "2025-08-18", status: "Failed", size: "0 MB", frequency: "Monthly", nextRun: "2025-09-01", createdBy: "Finance" },
  { id: "RPT-006", name: "Inventory Status Report", type: "Inventory", category: "Operations", lastGenerated: "2025-08-17", status: "Ready", size: "1.5 MB", frequency: "Daily", nextRun: "2025-08-23", createdBy: "System" },
];

const reportUsageData = [
  { month: 'Jan', generated: 45, downloaded: 38 },
  { month: 'Feb', generated: 52, downloaded: 44 },
  { month: 'Mar', generated: 48, downloaded: 41 },
  { month: 'Apr', generated: 61, downloaded: 52 },
  { month: 'May', generated: 58, downloaded: 49 },
  { month: 'Jun', generated: 67, downloaded: 58 },
];

const reportTypeData = [
  { name: 'Sales', value: 35, color: '#10B981' },
  { name: 'Operations', value: 28, color: '#3B82F6' },
  { name: 'Financial', value: 22, color: '#F59E0B' },
  { name: 'Marketing', value: 15, color: '#8B5CF6' },
];

const reportsColumns = [
  {
    accessorKey: 'id',
    header: 'Report ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Report Details',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('name')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Database className="w-3 h-3 mr-1" />
          {row.original.category} • {row.original.type}
        </div>
        <div className="text-xs text-gray-500">
          Created by {row.original.createdBy}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'frequency',
    header: 'Schedule',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-700">{row.getValue('frequency')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1" />
          Next: {row.original.nextRun}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'lastGenerated',
    header: 'Last Generated',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="text-sm text-gray-700">{row.getValue('lastGenerated')}</div>
        <div className="text-xs text-gray-500">{row.original.size}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      const colors = {
        'Ready': 'bg-green-100 text-green-800 border-green-200',
        'Generating': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Failed': 'bg-red-100 text-red-800 border-red-200',
      };
      return (
        <Badge 
          className={`${colors[status as keyof typeof colors]} border`}
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
          className="h-8 w-8 p-0 hover:bg-green-50"
          data-testid={`download-report-${row.original.id}`}
          disabled={row.original.status !== 'Ready'}
        >
          <Download className="h-4 w-4 text-green-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          data-testid={`view-report-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`report-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function ReportsPage() {
  const stats = [
    { title: "Total Reports", value: "248", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50", change: "+12.3%" },
    { title: "Generated Today", value: "18", icon: BarChart3, color: "text-green-600", bgColor: "bg-green-50", change: "+5.2%" },
    { title: "Scheduled Reports", value: "35", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-50", change: "+8.7%" },
    { title: "Download Rate", value: "87%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50", change: "+2.1%" },
  ];

  const quickReports = [
    { title: "Sales Summary", period: "Today", value: "₹1,24,500", change: "+12%" },
    { title: "Vendor Count", period: "Active", value: "98", change: "+5" },
    { title: "Delivery Rate", period: "Today", value: "94%", change: "+2%" },
    { title: "Customer Growth", period: "This Month", value: "156", change: "+18%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports &amp; Analytics</h1>
            <p className="text-gray-600 mt-1">Generate and manage business intelligence reports</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="schedule-report">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="eco-button" data-testid="custom-report">
              <Plus className="w-4 h-4 mr-2" />
              Custom Report
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
                      {stat.change} vs last month
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

        {/* Quick Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickReports.map((report, index) => (
            <Card key={index} className="eco-card cursor-pointer hover:shadow-lg transition-shadow" data-testid={`quick-${report.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">{report.title}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{report.value}</p>
                    <p className="text-gray-500 text-xs">{report.period}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-green-500 text-xs sm:text-sm font-semibold">{report.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Usage Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="report-usage-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Report Usage Trends</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="generated" fill="#3B82F6" name="Generated" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="downloaded" fill="#10B981" name="Downloaded" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Report Type Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="report-type-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Report Categories</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={reportTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {reportTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600 text-xs">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Report Library</h3>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none">
                Export List
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <DataTable
              columns={reportsColumns}
              data={reportsData}
              searchPlaceholder="Search reports..."
            />
          </div>
        </div>

        {/* Report Management */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow cursor-pointer" data-testid="pdf-export">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-red-50 flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">PDF Reports</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Professional PDF exports</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200 text-xs">
                    Generate PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow cursor-pointer" data-testid="excel-export">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-green-50 flex-shrink-0">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Excel Export</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Data analysis spreadsheets</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200 text-xs">
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1" data-testid="scheduled-reports">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-purple-50 flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Automation</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Scheduled report generation</p>
                  <Button variant="outline" size="sm" className="mt-2 text-purple-600 border-purple-200 text-xs">
                    Setup Schedule
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