import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Download, Calendar, TrendingUp, PieChart } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function ReportsPage() {
  const reports = [
    { name: "Daily Sales Report", type: "Sales", lastGenerated: "2024-01-15", status: "Ready", size: "2.4 MB" },
    { name: "Vendor Performance", type: "Vendor", lastGenerated: "2024-01-14", status: "Generating", size: "1.8 MB" },
    { name: "Delivery Efficiency", type: "Delivery", lastGenerated: "2024-01-13", status: "Ready", size: "3.2 MB" },
    { name: "Customer Analytics", type: "Customer", lastGenerated: "2024-01-12", status: "Ready", size: "2.1 MB" },
  ];

  const quickReports = [
    { title: "Sales Summary", period: "Today", value: "₹1,24,500", change: "+12%" },
    { title: "Vendor Count", period: "Active", value: "98", change: "+5" },
    { title: "Delivery Rate", period: "Today", value: "94%", change: "+2%" },
    { title: "Customer Growth", period: "This Month", value: "156", change: "+18%" },
  ];

  const reportCategories = [
    { name: "Sales Reports", icon: BarChart3, color: "text-green-500", count: 12 },
    { name: "Vendor Reports", icon: TrendingUp, color: "text-blue-500", count: 8 },
    { name: "Customer Reports", icon: PieChart, color: "text-purple-500", count: 6 },
    { name: "Financial Reports", icon: FileText, color: "text-orange-500", count: 10 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Reports & Analytics</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Generate and manage business reports</p>
          </div>
          <div className="flex space-x-3">
            <Button className="eco-button-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="eco-button">
              <FileText className="w-4 h-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickReports.map((report, index) => (
            <Card key={index} className="eco-card stats-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(var(--eco-text-muted))] text-sm font-medium">{report.title}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--eco-text))] mt-1">{report.value}</p>
                    <p className="text-[hsl(var(--eco-text-muted))] text-xs">{report.period}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-500 text-sm font-semibold">{report.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportCategories.map((category, index) => (
            <Card key={index} className="eco-card cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <category.icon className={`w-10 h-10 ${category.color}`} />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--eco-text))]">{category.name}</h3>
                    <p className="text-[hsl(var(--eco-text-muted))] text-sm">{category.count} reports available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Interactive revenue chart</p>
                  <p className="text-sm">Monthly performance trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>Customer acquisition chart</p>
                  <p className="text-sm">New vs returning customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Report Name</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Type</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Last Generated</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Size</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{report.name}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{report.type}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{report.lastGenerated}</td>
                      <td className="p-4">
                        <Badge className={report.status === 'Ready' ? 'eco-badge-success' : 'eco-badge-warning'}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{report.size}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">PDF Reports</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Export in PDF format</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Download className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Excel Export</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Download as spreadsheet</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Scheduled Reports</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Automate report generation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}