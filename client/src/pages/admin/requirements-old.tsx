import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, Zap, RefreshCw, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function RequirementsPage() {
  const forecasts = [
    { period: "Tomorrow", required: "1,720L", predicted: "1,680L", confidence: "95%", status: "On Track" },
    { period: "Next Week", required: "12,040L", predicted: "11,760L", confidence: "88%", status: "Shortage" },
    { period: "Next Month", required: "48,600L", predicted: "49,200L", confidence: "82%", status: "Surplus" },
  ];

  const stats = [
    { title: "Today's Requirement", value: "1,720L", icon: BarChart3, color: "text-blue-500" },
    { title: "Predicted Supply", value: "1,680L", icon: TrendingUp, color: "text-green-500" },
    { title: "Shortage Alert", value: "40L", icon: AlertTriangle, color: "text-red-500" },
    { title: "AI Confidence", value: "95%", icon: Zap, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Requirements & Forecast</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">AI-powered demand prediction and supply planning</p>
          </div>
          <Button className="eco-button">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Forecast
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

        {/* Forecast Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>Weekly demand prediction</p>
                  <p className="text-sm">AI-powered forecasting model</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Seasonal Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Summer vs Winter demand</p>
                  <p className="text-sm">Historical pattern analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Demand Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Period</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Required</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Predicted</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Confidence</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {forecasts.map((forecast, index) => (
                    <tr key={index} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{forecast.period}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{forecast.required}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{forecast.predicted}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{forecast.confidence}</td>
                      <td className="p-4">
                        <Badge className={
                          forecast.status === 'On Track' ? 'eco-badge-success' : 
                          forecast.status === 'Shortage' ? 'eco-badge-error' : 'eco-badge-warning'
                        }>
                          {forecast.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}