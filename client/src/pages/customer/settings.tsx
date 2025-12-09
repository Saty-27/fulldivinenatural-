import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Trash2,
  Download,
  Upload,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Mock settings data
  const [settings, setSettings] = useState({
    // Profile Settings
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    
    // App Preferences
    theme: "light",
    language: "english",
    currency: "INR",
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    offers: true,
    deliveryAlerts: true,
    
    // Privacy Settings
    profileVisibility: "private",
    dataSharing: false,
    analytics: true,
    
    // Security Settings
    biometricLogin: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    
    // Device Management
    devices: [
      { id: 1, name: "iPhone 13", location: "Bangalore", lastActive: "Active now", current: true },
      { id: 2, name: "MacBook Pro", location: "Bangalore", lastActive: "2 hours ago", current: false }
    ]
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      });
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const handleLogoutDevice = (deviceId: number) => {
    const updatedDevices = settings.devices.filter(device => device.id !== deviceId);
    handleSettingChange("devices", updatedDevices);
    toast({
      title: "Device logged out",
      description: "The device has been signed out of your account",
    });
  };

  const handleChangePassword = () => {
    // Mock password change
    changePasswordMutation.mutate({
      currentPassword: "current",
      newPassword: "new"
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm === "DELETE") {
      deleteAccountMutation.mutate();
    } else {
      toast({
        title: "Confirmation required",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data will be emailed to you within 24 hours",
    });
  };

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-[var(--eco-primary)] flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Divine Naturals Tree Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                Settings & Security
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">First Name</label>
                <Input
                  value={settings.firstName}
                  onChange={(e) => handleSettingChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Last Name</label>
                <Input
                  value={settings.lastName}
                  onChange={(e) => handleSettingChange("lastName", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <Input
                value={settings.phone}
                onChange={(e) => handleSettingChange("phone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {settings.theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">App Theme</h4>
                  <p className="text-sm text-[hsl(var(--eco-text-muted))]">Choose your preferred theme</p>
                </div>
              </div>
              <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">Language</h4>
                  <p className="text-sm text-[hsl(var(--eco-text-muted))]">Select your preferred language</p>
                </div>
              </div>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी</SelectItem>
                  <SelectItem value="marathi">मराठी</SelectItem>
                  <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">₹</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">Currency</h4>
                  <p className="text-sm text-[hsl(var(--eco-text-muted))]">Display currency preference</p>
                </div>
              </div>
              <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "pushNotifications", label: "Push Notifications", desc: "Receive notifications on your device" },
              { key: "emailNotifications", label: "Email Notifications", desc: "Get updates via email" },
              { key: "smsNotifications", label: "SMS Notifications", desc: "Receive SMS for important updates" },
              { key: "orderUpdates", label: "Order Updates", desc: "Notifications about your orders" },
              { key: "offers", label: "Offers & Promotions", desc: "Special deals and discounts" },
              { key: "deliveryAlerts", label: "Delivery Alerts", desc: "Real-time delivery notifications" }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">{label}</h4>
                  <p className="text-sm text-[hsl(var(--eco-text-muted))]">{desc}</p>
                </div>
                <Switch
                  checked={settings[key as keyof typeof settings] as boolean}
                  onCheckedChange={(checked) => handleSettingChange(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Biometric Login */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">Biometric Login</h4>
                <p className="text-sm text-[hsl(var(--eco-text-muted))]">Use fingerprint or face ID</p>
              </div>
              <Switch
                checked={settings.biometricLogin}
                onCheckedChange={(checked) => handleSettingChange("biometricLogin", checked)}
              />
            </div>

            {/* Two Factor Auth */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">Two-Factor Authentication</h4>
                <p className="text-sm text-[hsl(var(--eco-text-muted))]">Add extra security to your account</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
              />
            </div>

            {/* Change Password */}
            <div>
              <h4 className="font-semibold text-[hsl(var(--eco-secondary))] mb-3">Change Password</h4>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Current password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Input
                  type="password"
                  placeholder="New password"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                />
                <Button 
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="w-full eco-button-secondary"
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Manage Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings.devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--eco-secondary))] flex items-center space-x-2">
                      <span>{device.name}</span>
                      {device.current && <Badge className="bg-green-500 text-white text-xs">Current</Badge>}
                    </h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">
                      {device.location} • {device.lastActive}
                    </p>
                  </div>
                </div>
                {!device.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogoutDevice(device.id)}
                    className="text-red-500 border-red-200"
                  >
                    Logout
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={exportData}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Download className="w-6 h-6" />
                <span className="font-semibold">Export Data</span>
                <span className="text-xs text-[hsl(var(--eco-text-muted))] text-center">
                  Download your account data
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Upload className="w-6 h-6" />
                <span className="font-semibold">Import Data</span>
                <span className="text-xs text-[hsl(var(--eco-text-muted))] text-center">
                  Import data from another service
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
              <p className="text-sm text-red-600 mb-4">
                This action cannot be undone. This will permanently delete your account and remove all your data.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="border-red-200"
                />
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "DELETE" || deleteAccountMutation.isPending}
                  className="bg-red-600 text-white hover:bg-red-700 w-full"
                >
                  {deleteAccountMutation.isPending ? (
                    "Deleting Account..."
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account Permanently
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Privacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 text-[hsl(var(--eco-primary))] mx-auto mb-2" />
              <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Privacy Policy</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">Learn how we protect your data</p>
            </CardContent>
          </Card>

          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-[hsl(var(--eco-primary))] mx-auto mb-2" />
              <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Terms of Service</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">Read our terms and conditions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}