import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CreditCard, PieChart, Plus, Search, Filter, Eye, MoreHorizontal, Receipt, FileText, AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const transactionData = [
  { id: "TXN-001", type: "Revenue", description: "Daily Milk Sales", amount: 124500, status: "Completed", date: "2025-08-22", category: "Sales" },
  { id: "TXN-002", type: "Expense", description: "Vendor Payment - Nandini Dairy", amount: -45000, status: "Completed", date: "2025-08-22", category: "Vendor" },
  { id: "TXN-003", type: "Revenue", description: "Weekly Subscription Collection", amount: 89200, status: "Pending", date: "2025-08-21", category: "Subscription" },
  { id: "TXN-004", type: "Expense", description: "Delivery Partner Payments", amount: -28500, status: "Completed", date: "2025-08-21", category: "Logistics" },
  { id: "TXN-005", type: "Revenue", description: "Premium Product Sales", amount: 56800, status: "Completed", date: "2025-08-20", category: "Sales" },
  { id: "TXN-006", type: "Expense", description: "Equipment Maintenance", amount: -15200, status: "Completed", date: "2025-08-20", category: "Operations" },
];

const revenueData = [
  { month: 'Jan', revenue: 3200000, expenses: 2480000, profit: 720000 },
  { month: 'Feb', revenue: 3450000, expenses: 2650000, profit: 800000 },
  { month: 'Mar', revenue: 3680000, expenses: 2820000, profit: 860000 },
  { month: 'Apr', revenue: 3420000, expenses: 2590000, profit: 830000 },
  { month: 'May', revenue: 3890000, expenses: 2950000, profit: 940000 },
  { month: 'Jun', revenue: 4120000, expenses: 3100000, profit: 1020000 },
];

const expenseData = [
  { name: 'Vendor Payments', value: 45, color: '#3B82F6' },
  { name: 'Logistics', value: 20, color: '#10B981' },
  { name: 'Staff Salaries', value: 18, color: '#F59E0B' },
  { name: 'Operations', value: 12, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#8B5CF6' },
];

const transactionColumns = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('description')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {row.original.date}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }: any) => {
      const type = row.getValue('type') as string;
      return (
        <Badge 
          className={`${type === 'Revenue' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'} border`}
        >
          {type === 'Revenue' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => {
      const amount = row.getValue('amount') as number;
      const isPositive = amount > 0;
      return (
        <div className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          ₹{Math.abs(amount).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }: any) => (
      <div className="text-sm text-gray-700">
        {row.getValue('category')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          className={`${status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} border`}
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
          data-testid={`view-transaction-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`transaction-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function FinancePage() {
  const stats = [
    { title: "Today's Revenue", value: "₹1,24,500", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50", change: "+12.5%" },
    { title: "Monthly Revenue", value: "₹34,25,000", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50", change: "+18.2%" },
    { title: "Outstanding Payments", value: "₹2,45,800", icon: CreditCard, color: "text-orange-600", bgColor: "bg-orange-50", change: "-8.4%" },
    { title: "Net Profit", value: "₹8,95,200", icon: PieChart, color: "text-purple-600", bgColor: "bg-purple-50", change: "+15.7%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Revenue &amp; Finance</h1>
            <p className="text-gray-600 mt-1">Financial overview and transaction management</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="generate-invoice">
              <Receipt className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
            <Button className="eco-button" data-testid="export-report">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="revenue-trend-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses Trend</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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
                    tickFormatter={(value) => `₹${value/100000}L`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.1}
                    strokeWidth={3}
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="expense-distribution-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
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
              columns={transactionColumns}
              data={transactionData}
              searchPlaceholder="Search transactions..."
            />
          </div>
        </div>

        {/* Financial Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="bank-settlement">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-orange-50 flex-shrink-0">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Bank Settlement</h3>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">₹45,200 pending settlement</p>
                  <Button variant="outline" size="sm" className="mt-2 text-orange-600 border-orange-200 text-xs">
                    Process Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="growth-rate">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-green-50 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Growth Rate</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">18% increase this month</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200 text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1" data-testid="tax-summary">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-purple-50 flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">GST Summary</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">₹2,45,800 tax calculated</p>
                  <Button variant="outline" size="sm" className="mt-2 text-purple-600 border-purple-200 text-xs">
                    File Returns
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