import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Users, TrendingDown, Plus, Search, Filter, Eye, MoreHorizontal, Phone, Mail, Calendar, User } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const complaintsData = [
  { id: "COMP-001", customer: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "+91 98765 43210", category: "Delivery", issue: "Late delivery to Koramangala", status: "Pending", priority: "High", date: "2025-08-22", assignedTo: "Support Team A", responseTime: "2.5h" },
  { id: "COMP-002", customer: "Priya Sharma", email: "priya@gmail.com", phone: "+91 98765 43211", category: "Quality", issue: "Milk quality issue - sour taste", status: "Resolved", priority: "Medium", date: "2025-08-21", assignedTo: "Quality Team", responseTime: "1.8h" },
  { id: "COMP-003", customer: "Amit Patel", email: "amit@gmail.com", phone: "+91 98765 43212", category: "Payment", issue: "Double billing for subscription", status: "In Progress", priority: "High", date: "2025-08-20", assignedTo: "Finance Team", responseTime: "3.2h" },
  { id: "COMP-004", customer: "Sunita Devi", email: "sunita@gmail.com", phone: "+91 98765 43213", category: "Delivery", issue: "Missing delivery on Saturday", status: "Pending", priority: "Medium", date: "2025-08-19", assignedTo: "Delivery Team", responseTime: "4.1h" },
  { id: "COMP-005", customer: "Vikram Singh", email: "vikram@gmail.com", phone: "+91 98765 43214", category: "Service", issue: "Unable to modify subscription", status: "Resolved", priority: "Low", date: "2025-08-18", assignedTo: "Tech Support", responseTime: "1.2h" },
  { id: "COMP-006", customer: "Anjali Reddy", email: "anjali@gmail.com", phone: "+91 98765 43215", category: "Quality", issue: "Packaging damaged on arrival", status: "In Progress", priority: "Medium", date: "2025-08-17", assignedTo: "Quality Team", responseTime: "2.8h" },
];

const responseTimeData = [
  { day: 'Mon', avgTime: 2.1, resolved: 8 },
  { day: 'Tue', avgTime: 1.8, resolved: 12 },
  { day: 'Wed', avgTime: 2.5, resolved: 6 },
  { day: 'Thu', avgTime: 1.9, resolved: 10 },
  { day: 'Fri', avgTime: 2.3, resolved: 9 },
  { day: 'Sat', avgTime: 3.2, resolved: 5 },
  { day: 'Sun', avgTime: 2.8, resolved: 4 },
];

const categoryData = [
  { name: 'Delivery Issues', value: 40, color: '#3B82F6' },
  { name: 'Quality Concerns', value: 27, color: '#EF4444' },
  { name: 'Payment Problems', value: 18, color: '#F59E0B' },
  { name: 'Service Issues', value: 15, color: '#10B981' },
];

const complaintsColumns = [
  {
    accessorKey: 'id',
    header: 'Ticket ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer Details',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('customer')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Mail className="w-3 h-3 mr-1" />
          {row.original.email}
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Phone className="w-3 h-3 mr-1" />
          {row.original.phone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'issue',
    header: 'Issue Description',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900 text-sm">{row.getValue('issue')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {row.original.date}
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <User className="w-3 h-3 mr-1" />
          {row.original.assignedTo}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }: any) => {
      const category = row.getValue('category') as string;
      const colors = {
        'Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
        'Quality': 'bg-red-100 text-red-800 border-red-200',
        'Payment': 'bg-orange-100 text-orange-800 border-orange-200',
        'Service': 'bg-green-100 text-green-800 border-green-200',
      };
      return (
        <Badge className={`${colors[category as keyof typeof colors]} border`}>
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }: any) => {
      const priority = row.getValue('priority') as string;
      const colors = {
        'High': 'bg-red-100 text-red-800 border-red-200',
        'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Low': 'bg-green-100 text-green-800 border-green-200',
      };
      return (
        <Badge className={`${colors[priority as keyof typeof colors]} border`}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'responseTime',
    header: 'Response Time',
    cell: ({ row }: any) => {
      const time = row.getValue('responseTime') as string;
      const hours = parseFloat(time);
      const color = hours <= 2 ? 'text-green-600' : hours <= 4 ? 'text-yellow-600' : 'text-red-600';
      return <div className={`text-sm font-medium ${color}`}>{time}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      const colors = {
        'Resolved': 'bg-green-100 text-green-800 border-green-200',
        'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Pending': 'bg-red-100 text-red-800 border-red-200',
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
          className="h-8 w-8 p-0 hover:bg-blue-50"
          data-testid={`view-complaint-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`complaint-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function ComplaintsPage() {
  const stats = [
    { title: "Total Complaints", value: "45", icon: MessageSquare, color: "text-blue-600", bgColor: "bg-blue-50", change: "+8.3%" },
    { title: "Pending", value: "12", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", change: "-15.2%" },
    { title: "Resolved", value: "28", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", change: "+22.1%" },
    { title: "Avg Response Time", value: "2.4h", icon: TrendingDown, color: "text-purple-600", bgColor: "bg-purple-50", change: "-18.5%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complaints &amp; Support</h1>
            <p className="text-gray-600 mt-1">Manage customer complaints and support tickets</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="bulk-assign">
              <Users className="w-4 h-4 mr-2" />
              Bulk Assign
            </Button>
            <Button className="eco-button" data-testid="create-ticket">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
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
                    <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? (stat.title === 'Total Complaints' ? 'text-red-600' : 'text-green-600') : 'text-green-600'}`}>
                      {stat.change} vs last week
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

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="response-time-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Weekly Response Performance</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
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
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}h`, 'Avg Response Time']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgTime" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Response Time"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Complaint Categories */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100" data-testid="complaint-categories-chart">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Complaint Categories</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
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

        {/* Complaints Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Support Tickets</h3>
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
              columns={complaintsColumns}
              data={complaintsData}
              searchPlaceholder="Search complaints..."
            />
          </div>
        </div>

        {/* Support Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="urgent-tickets">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-red-50 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Urgent Tickets</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">5 high priority pending resolution</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200 text-xs">
                    Review Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="customer-satisfaction">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-green-50 flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Customer Satisfaction</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">4.2/5 average rating this month</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200 text-xs">
                    View Survey
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1" data-testid="resolution-rate">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 rounded-xl bg-blue-50 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Resolution Rate</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">88% resolved within 24 hours</p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-200 text-xs">
                    Improve SLA
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