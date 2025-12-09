import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Bell, CreditCard, Globe, Shield, Database, Plus, Search, Filter, Eye, MoreHorizontal, User, Mail, Smartphone, Lock, Palette, Clock, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

const settingSections = [
  { 
    id: 1,
    name: "General Settings", 
    icon: Settings, 
    description: "Basic system configuration", 
    color: "text-blue-600", 
    bgColor: "bg-blue-50",
    status: "Configured",
    lastUpdated: "2025-08-20"
  },
  { 
    id: 2,
    name: "Notification Settings", 
    icon: Bell, 
    description: "SMS, Email, WhatsApp alerts", 
    color: "text-green-600", 
    bgColor: "bg-green-50",
    status: "Active",
    lastUpdated: "2025-08-22"
  },
  { 
    id: 3,
    name: "Payment Gateway", 
    icon: CreditCard, 
    description: "Configure payment methods", 
    color: "text-orange-600", 
    bgColor: "bg-orange-50",
    status: "Configured",
    lastUpdated: "2025-08-15"
  },
  { 
    id: 4,
    name: "Localization", 
    icon: Globe, 
    description: "Language and timezone settings", 
    color: "text-purple-600", 
    bgColor: "bg-purple-50",
    status: "Configured",
    lastUpdated: "2025-08-18"
  },
  { 
    id: 5,
    name: "Security & Access", 
    icon: Shield, 
    description: "Access control and security", 
    color: "text-red-600", 
    bgColor: "bg-red-50",
    status: "Needs Review",
    lastUpdated: "2025-08-10"
  },
  { 
    id: 6,
    name: "Data Management", 
    icon: Database, 
    description: "Backup and restore options", 
    color: "text-indigo-600", 
    bgColor: "bg-indigo-50",
    status: "Active",
    lastUpdated: "2025-08-21"
  },
];

const quickSettings = [
  {
    title: "Email Notifications",
    description: "Receive email alerts for important events",
    enabled: true,
    icon: Mail,
    category: "Communications"
  },
  {
    title: "SMS Alerts",
    description: "Get SMS notifications for critical issues",
    enabled: true,
    icon: Smartphone,
    category: "Communications"
  },
  {
    title: "Auto Backup",
    description: "Automatic daily data backups at 2 AM",
    enabled: true,
    icon: Database,
    category: "Data"
  },
  {
    title: "Two-Factor Authentication",
    description: "Enhanced security with 2FA login",
    enabled: false,
    icon: Lock,
    category: "Security"
  },
  {
    title: "Theme Customization",
    description: "Customize appearance and branding",
    enabled: true,
    icon: Palette,
    category: "Interface"
  },
  {
    title: "Session Timeout",
    description: "Auto logout after 30 minutes of inactivity",
    enabled: true,
    icon: Clock,
    category: "Security"
  },
];

const systemInfo = [
  { label: "System Version", value: "v2.4.1", status: "Latest" },
  { label: "Database Version", value: "PostgreSQL 15.2", status: "Stable" },
  { label: "Last Backup", value: "2025-08-22 02:00 AM", status: "Success" },
  { label: "Storage Used", value: "2.4 GB / 10 GB", status: "Good" },
  { label: "Active Users", value: "45 users", status: "Normal" },
  { label: "Uptime", value: "99.8% (30 days)", status: "Excellent" },
];

export default function SettingsPage() {
  const stats = [
    { title: "Total Settings", value: "48", icon: Settings, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Alerts", value: "12", icon: Bell, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "System Health", value: "99.8%", icon: Shield, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Last Backup", value: "2h ago", icon: Database, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings &amp; Configuration</h1>
            <p className="text-gray-600 mt-1">Manage system settings and preferences</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="export-settings">
              <Search className="w-4 h-4 mr-2" />
              Export Config
            </Button>
            <Button className="eco-button" data-testid="backup-settings">
              <Plus className="w-4 h-4 mr-2" />
              Create Backup
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
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Settings Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {settingSections.map((section) => (
            <Card key={section.id} className="eco-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" data-testid={`setting-${section.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 sm:p-3 rounded-xl ${section.bgColor} flex-shrink-0`}>
                    <section.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${section.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{section.name}</h3>
                      <Badge 
                        className={`ml-2 text-xs ${
                          section.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                          section.status === 'Needs Review' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-blue-100 text-blue-800 border-blue-200'
                        } border flex-shrink-0`}
                      >
                        {section.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">{section.description}</p>
                    <p className="text-gray-500 text-xs mt-2">Updated: {section.lastUpdated}</p>
                    <Button variant="outline" size="sm" className={`mt-3 text-xs ${section.color.replace('text-', 'border-').replace('-600', '-200')} hover:${section.bgColor}`}>
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">Quick Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors" data-testid={`quick-${setting.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-white">
                    <setting.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{setting.title}</h4>
                    <p className="text-gray-600 text-xs truncate">{setting.description}</p>
                    <Badge className="mt-1 text-xs bg-gray-200 text-gray-700">{setting.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                  <div className={`w-2 h-2 rounded-full ${setting.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <Button variant="outline" size="sm" className="text-xs">
                    {setting.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">System Information</h3>
            <div className="space-y-4">
              {systemInfo.map((info, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{info.label}</span>
                    <div className="text-xs text-gray-600 mt-1">{info.value}</div>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      info.status === 'Success' || info.status === 'Latest' || info.status === 'Excellent' ? 'bg-green-100 text-green-800 border-green-200' :
                      info.status === 'Good' || info.status === 'Normal' || info.status === 'Stable' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    } border`}
                  >
                    {info.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">System Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50" variant="outline" data-testid="restart-system">
                <Settings className="w-4 h-4 mr-2" />
                Restart System Services
              </Button>
              <Button className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50" variant="outline" data-testid="create-backup">
                <Database className="w-4 h-4 mr-2" />
                Create System Backup
              </Button>
              <Button className="w-full justify-start text-purple-600 border-purple-200 hover:bg-purple-50" variant="outline" data-testid="update-system">
                <Shield className="w-4 h-4 mr-2" />
                Check for Updates
              </Button>
              <Button className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50" variant="outline" data-testid="export-logs">
                <Settings className="w-4 h-4 mr-2" />
                Export System Logs
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Emergency Actions</h4>
              <div className="space-y-2">
                <Button className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" variant="outline" data-testid="emergency-maintenance">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Maintenance Mode
                </Button>
                <Button className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" variant="outline" data-testid="factory-reset">
                  <Lock className="w-4 h-4 mr-2" />
                  Factory Reset (Danger)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}