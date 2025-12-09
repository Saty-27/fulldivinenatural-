import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Users, TrendingDown } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function ComplaintsPage() {
  const complaints = [
    { id: "COMP-001", customer: "Rajesh Kumar", category: "Delivery", issue: "Late delivery", status: "Pending", priority: "High", date: "2024-01-15" },
    { id: "COMP-002", customer: "Priya Sharma", category: "Quality", issue: "Milk quality issue", status: "Resolved", priority: "Medium", date: "2024-01-14" },
    { id: "COMP-003", customer: "Amit Patel", category: "Payment", issue: "Double billing", status: "In Progress", priority: "High", date: "2024-01-13" },
    { id: "COMP-004", customer: "Sunita Devi", category: "Delivery", issue: "Missing delivery", status: "Pending", priority: "Medium", date: "2024-01-12" },
  ];

  const stats = [
    { title: "Total Complaints", value: "45", icon: MessageSquare, color: "text-blue-500" },
    { title: "Pending", value: "12", icon: Clock, color: "text-orange-500" },
    { title: "Resolved", value: "28", icon: CheckCircle, color: "text-green-500" },
    { title: "Avg Response Time", value: "2.4h", icon: TrendingDown, color: "text-purple-500" },
  ];

  const categories = [
    { name: "Delivery Issues", count: 18, percentage: 40 },
    { name: "Quality Concerns", count: 12, percentage: 27 },
    { name: "Payment Problems", count: 8, percentage: 18 },
    { name: "Service Issues", count: 7, percentage: 15 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Complaints & Support</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Manage customer complaints and support tickets</p>
          </div>
          <Button className="eco-button">
            <MessageSquare className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="eco-card stats-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(var(--eco-text-muted))] text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--eco-text))] mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Complaint Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[hsl(var(--eco-text))] font-medium">{category.name}</span>
                        <span className="text-[hsl(var(--eco-text))] font-semibold">{category.count}</span>
                      </div>
                      <div className="w-full bg-[hsl(var(--eco-border))] rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[hsl(var(--eco-text-muted))] text-sm ml-4">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Response Time Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <p>Average response time chart</p>
                  <p className="text-sm">Weekly performance metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Ticket ID</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Customer</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Category</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Issue</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Priority</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Date</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{complaint.id}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{complaint.customer}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{complaint.category}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{complaint.issue}</td>
                      <td className="p-4">
                        <Badge className={complaint.priority === 'High' ? 'eco-badge-error' : 'eco-badge-warning'}>
                          {complaint.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          complaint.status === 'Resolved' ? 'eco-badge-success' : 
                          complaint.status === 'In Progress' ? 'eco-badge-warning' : 'eco-badge-error'
                        }>
                          {complaint.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{complaint.date}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" className="mr-2">Assign</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Urgent Tickets</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">5 high priority pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Customer Satisfaction</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">4.2/5 average rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Resolution Rate</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">88% within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}