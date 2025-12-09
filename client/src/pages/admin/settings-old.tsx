import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, CreditCard, Globe, Shield, Database } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function SettingsPage() {
  const settingSections = [
    { name: "General Settings", icon: Settings, description: "Basic system configuration" },
    { name: "Notifications", icon: Bell, description: "SMS, Email, WhatsApp alerts" },
    { name: "Payment Gateway", icon: CreditCard, description: "Configure payment methods" },
    { name: "Localization", icon: Globe, description: "Language and timezone settings" },
    { name: "Security", icon: Shield, description: "Access control and security" },
    { name: "Data Management", icon: Database, description: "Backup and restore options" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Settings & Configuration</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Manage system settings and preferences</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingSections.map((section, index) => (
            <Card key={index} className="eco-card cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <section.icon className="w-10 h-10 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--eco-text))]">{section.name}</h3>
                    <p className="text-[hsl(var(--eco-text-muted))] text-sm">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Settings */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Quick Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--eco-border))]/30 rounded-lg">
              <div>
                <h4 className="font-medium text-[hsl(var(--eco-text))]">Email Notifications</h4>
                <p className="text-[hsl(var(--eco-text-muted))] text-sm">Receive email alerts for important events</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--eco-border))]/30 rounded-lg">
              <div>
                <h4 className="font-medium text-[hsl(var(--eco-text))]">Auto Backup</h4>
                <p className="text-[hsl(var(--eco-text-muted))] text-sm">Automatic daily data backups</p>
              </div>
              <Button variant="outline">Setup</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--eco-border))]/30 rounded-lg">
              <div>
                <h4 className="font-medium text-[hsl(var(--eco-text))]">Theme Settings</h4>
                <p className="text-[hsl(var(--eco-text-muted))] text-sm">Customize appearance and branding</p>
              </div>
              <Button variant="outline">Customize</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}