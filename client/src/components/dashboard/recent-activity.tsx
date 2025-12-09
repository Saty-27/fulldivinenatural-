import React from 'react';
import { Clock, User, Package, Truck, AlertTriangle } from 'lucide-react';

interface RecentActivityProps {
  orders: any[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <Package className="w-4 h-4 text-blue-600" />;
    case 'delivery':
      return <Truck className="w-4 h-4 text-green-600" />;
    case 'customer':
      return <User className="w-4 h-4 text-purple-600" />;
    case 'alert':
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export function RecentActivityWidget({ orders = [] }: RecentActivityProps) {
  // Convert real orders to activities
  const recentActivities = orders.map((order: any) => ({
    id: order.id?.toString() || 'unknown',
    type: order.status === 'delivered' ? 'delivery' : 'order',
    title: order.status === 'delivered' ? 'Order delivered' : `Order ${order.status}`,
    description: `Order #${order.id}`,
    timestamp: order.createdAt || new Date().toISOString(),
    priority: order.status === 'pending' ? 'high' : 'normal'
  })).slice(0, 6); // Show last 6 activities

  if (recentActivities.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="recent-activity">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center text-gray-400 py-8">
          No recent activities
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="recent-activity">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {recentActivities.map((activity, index) => (
          <div
            key={activity.id || index}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors"
            data-testid={`activity-${activity.id}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </h4>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
