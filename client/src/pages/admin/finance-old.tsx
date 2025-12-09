import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CreditCard, FileText, PieChart, Receipt } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function FinancePage() {
  const stats = [
    { title: "Today's Revenue", value: "₹1,24,500", icon: DollarSign, color: "text-green-500" },
    { title: "Monthly Revenue", value: "₹34,25,000", icon: TrendingUp, color: "text-blue-500" },
    { title: "Outstanding Payments", value: "₹2,45,800", icon: CreditCard, color: "text-orange-500" },
    { title: "Net Profit", value: "₹8,95,200", icon: PieChart, color: "text-purple-500" },
  ];

  const expenses = [
    { category: "Vendor Payments", amount: "₹15,45,000", percentage: 45 },
    { category: "Logistics & Delivery", amount: "₹5,20,000", percentage: 15 },
    { category: "Staff Salaries", amount: "₹4,80,000", percentage: 14 },
    { category: "Utilities & Maintenance", amount: "₹2,10,000", percentage: 6 },
    { category: "Marketing", amount: "₹1,85,000", percentage: 5 },
    { category: "Other Expenses", amount: "₹3,25,000", percentage: 10 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Revenue & Finance</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Financial overview and expense management</p>
          </div>
          <div className="flex space-x-3">
            <Button className="eco-button-secondary">
              <Receipt className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
            <Button className="eco-button">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Revenue Stats */}
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
              <CardTitle className="text-[hsl(var(--eco-text))]">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Monthly revenue growth chart</p>
                  <p className="text-sm">12-month financial trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Profit vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <PieChart className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>Profit margin analysis</p>
                  <p className="text-sm">Revenue vs expense breakdown</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Breakdown */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[hsl(var(--eco-border))]/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[hsl(var(--eco-text))] font-medium">{expense.category}</span>
                      <span className="text-[hsl(var(--eco-text))] font-semibold">{expense.amount}</span>
                    </div>
                    <div className="w-full bg-[hsl(var(--eco-border))] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-[hsl(var(--eco-text-muted))] text-sm ml-4">{expense.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CreditCard className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Bank Settlement</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">₹45,200 pending settlement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Growth Rate</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">18% increase this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">GST Summary</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">₹2,45,800 tax calculated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}