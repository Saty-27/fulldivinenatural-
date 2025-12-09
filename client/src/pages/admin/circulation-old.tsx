import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Milk, TrendingUp, MapPin, AlertTriangle, RefreshCw, Calendar } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function CirculationPage() {
  const circulationData = [
    { region: "Koramangala", procured: 450, distributed: 425, required: 480, wastage: 15 },
    { region: "Indiranagar", procured: 380, distributed: 370, required: 390, wastage: 8 },
    { region: "Whitefield", procured: 520, distributed: 495, required: 500, wastage: 20 },
    { region: "Jayanagar", procured: 340, distributed: 335, required: 350, wastage: 5 },
  ];

  const stats = [
    { title: "Total Procured", value: "1,690L", icon: Milk, color: "text-blue-500" },
    { title: "Total Distributed", value: "1,625L", icon: TrendingUp, color: "text-green-500" },
    { title: "Required Today", value: "1,720L", icon: Calendar, color: "text-orange-500" },
    { title: "Total Wastage", value: "48L", icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Milk Circulation</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Monitor daily milk flow and distribution</p>
          </div>
          <Button className="eco-button">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Circulation
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
              <CardTitle className="text-[hsl(var(--eco-text))]">Supply vs Demand Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>Daily supply vs demand chart</p>
                  <p className="text-sm">7-day trending analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Regional Distribution Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Interactive regional map</p>
                  <p className="text-sm">Area-wise circulation overview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Circulation Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Region-wise Circulation Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Region</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Procured (L)</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Distributed (L)</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Required (L)</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Wastage (L)</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {circulationData.map((region, index) => {
                    const shortage = region.required - region.distributed;
                    const status = shortage > 0 ? 'Under-supply' : 'Adequate';
                    return (
                      <tr key={index} className="border-b border-[hsl(var(--eco-border))]">
                        <td className="p-4 text-[hsl(var(--eco-text))]">{region.region}</td>
                        <td className="p-4 text-[hsl(var(--eco-text))]">{region.procured}</td>
                        <td className="p-4 text-[hsl(var(--eco-text))]">{region.distributed}</td>
                        <td className="p-4 text-[hsl(var(--eco-text))]">{region.required}</td>
                        <td className="p-4 text-[hsl(var(--eco-text))]">{region.wastage}</td>
                        <td className="p-4">
                          <Badge className={status === 'Adequate' ? 'eco-badge-success' : 'eco-badge-warning'}>
                            {status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Supply Alert</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Koramangala: 55L shortage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Milk className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Best Performance</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Jayanagar: 98.5% efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Weekly Forecast</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">15% increase expected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}