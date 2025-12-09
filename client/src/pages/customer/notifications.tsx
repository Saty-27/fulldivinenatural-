import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Bell, 
  Settings,
  Truck,
  Package,
  Gift,
  Star,
  AlertTriangle,
  Clock,
  CheckCircle,
  Trash2,
  Volume2,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function NotificationsCenter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "delivery",
      title: "Your milk is out for delivery!",
      message: "Amit is on the way with your 2L toned milk. ETA: 15 minutes",
      time: "10 minutes ago",
      isRead: false,
      priority: "high"
    },
    {
      id: 2,
      type: "offer",
      title: "🎉 Special Weekend Offer",
      message: "Get 20% off on all dairy products this weekend. Use code WEEKEND20",
      time: "2 hours ago",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "subscription",
      title: "Subscription Renewal Reminder",
      message: "Your monthly milk subscription will renew in 3 days for ₹600",
      time: "1 day ago",
      isRead: true,
      priority: "medium"
    },
    {
      id: 4,
      type: "delivery",
      title: "Delivery Completed",
      message: "Your order has been delivered successfully. Please rate your experience",
      time: "1 day ago",
      isRead: true,
      priority: "low"
    },
    {
      id: 5,
      type: "product",
      title: "New Product Alert",
      message: "Fresh A2 Cow Ghee now available! Limited time launch offer - 15% off",
      time: "2 days ago",
      isRead: true,
      priority: "medium"
    },
    {
      id: 6,
      type: "system",
      title: "Welcome to Divine Naturals!",
      message: "Thank you for joining us. Complete your profile to get personalized recommendations",
      time: "3 days ago",
      isRead: true,
      priority: "low"
    }
  ];

  // Mock notification preferences
  const [preferences, setPreferences] = useState({
    deliveryUpdates: true,
    orderUpdates: true,
    offers: true,
    newProducts: false,
    subscriptionReminders: true,
    communityUpdates: false,
    pushNotifications: true,
    smsNotifications: true,
    emailNotifications: true,
    whatsappNotifications: true
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Notification marked as read",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Notification deleted",
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: any) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newPreferences;
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your notification settings have been saved",
      });
    },
  });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery": return <Truck className="w-5 h-5 text-blue-600" />;
      case "offer": return <Gift className="w-5 h-5 text-orange-600" />;
      case "subscription": return <Package className="w-5 h-5 text-green-600" />;
      case "product": return <Star className="w-5 h-5 text-purple-600" />;
      case "system": return <Bell className="w-5 h-5 text-gray-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return "border-l-red-500 bg-red-50";
    if (priority === "medium") return "border-l-orange-500 bg-orange-50";
    return "border-l-gray-300 bg-white";
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updatePreferencesMutation.mutate(newPreferences);
  };

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-60"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
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
                  Notifications
                </h1>
                <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                  {unreadCount} unread messages
                </p>
              </div>
            </div>
            <Link href="/notifications/settings">
              <Button variant="outline" className="flex-shrink-0">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-blue-600">{unreadCount}</div>
              <div className="text-sm text-blue-700 font-semibold">Unread</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-green-600">
                {notifications.filter(n => n.type === "delivery").length}
              </div>
              <div className="text-sm text-green-700 font-semibold">Delivery</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-orange-600">
                {notifications.filter(n => n.type === "offer").length}
              </div>
              <div className="text-sm text-orange-700 font-semibold">Offers</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-purple-600">
                {notifications.filter(n => n.type === "product").length}
              </div>
              <div className="text-sm text-purple-700 font-semibold">Products</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All", icon: Bell },
            { key: "unread", label: "Unread", icon: AlertTriangle },
            { key: "delivery", label: "Delivery", icon: Truck },
            { key: "offer", label: "Offers", icon: Gift },
            { key: "subscription", label: "Subscription", icon: Package },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
              className="whitespace-nowrap"
            >
              <Icon className="w-4 h-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                  !notification.isRead ? 'shadow-lg' : 'shadow-sm'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-[hsl(var(--eco-secondary))]' : 'text-gray-600'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-[hsl(var(--eco-text-muted))]" />
                          <span className="text-xs text-[hsl(var(--eco-text-muted))]">
                            {notification.time}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotificationMutation.mutate(notification.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-[hsl(var(--eco-text-muted))] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">No notifications</h3>
              <p className="text-[hsl(var(--eco-text-muted))]">
                {filter === "unread" ? "All caught up! No unread notifications." : "You don't have any notifications yet."}
              </p>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Preferences */}
            <div>
              <h4 className="font-semibold text-[hsl(var(--eco-secondary))] mb-3">What to notify about</h4>
              <div className="space-y-3">
                {[
                  { key: "deliveryUpdates", label: "Delivery Updates", desc: "Get notified about delivery status" },
                  { key: "orderUpdates", label: "Order Updates", desc: "Order confirmations and updates" },
                  { key: "offers", label: "Offers & Promotions", desc: "Special deals and discounts" },
                  { key: "newProducts", label: "New Products", desc: "Latest product launches" },
                  { key: "subscriptionReminders", label: "Subscription Reminders", desc: "Renewal and payment reminders" },
                  { key: "communityUpdates", label: "Community Updates", desc: "Farm stories and wellness tips" }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-[hsl(var(--eco-secondary))]">{label}</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))]">{desc}</p>
                    </div>
                    <Switch
                      checked={preferences[key as keyof typeof preferences] as boolean}
                      onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Preferences */}
            <div>
              <h4 className="font-semibold text-[hsl(var(--eco-secondary))] mb-3">How to receive notifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "pushNotifications", label: "Push Notifications", icon: Smartphone },
                  { key: "smsNotifications", label: "SMS", icon: MessageSquare },
                  { key: "emailNotifications", label: "Email", icon: Mail },
                  { key: "whatsappNotifications", label: "WhatsApp", icon: MessageSquare }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-[hsl(var(--eco-primary))]" />
                      <span className="font-semibold text-[hsl(var(--eco-secondary))]">{label}</span>
                    </div>
                    <Switch
                      checked={preferences[key as keyof typeof preferences] as boolean}
                      onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Mark All as Read</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">Clear all unread notifications</p>
            </CardContent>
          </Card>

          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <Volume2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Test Notifications</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">Send a test notification</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}