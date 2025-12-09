import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Charts that accept real data as props instead of hardcoded values
export function RevenueChart({ orders = [] }: { orders?: any[] }) {
  // Calculate revenue by month from orders
  const monthlyData: any = {};
  
  orders.forEach((order: any) => {
    const date = new Date(order.createdAt || new Date());
    const monthKey = date.toLocaleString('default', { month: 'short' });
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (order.total || 0);
  });

  const chartData = Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue: revenue as number,
  }));

  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="revenue-chart">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="h-80 flex items-center justify-center text-gray-400">
          No revenue data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="revenue-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '12px', fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '12px', fill: '#6B7280' }}
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart({ orders = [] }: { orders?: any[] }) {
  // Group orders by date
  const dailyData: any = {};
  
  orders.forEach((order: any) => {
    const date = new Date(order.createdAt || new Date());
    const dateKey = date.toLocaleDateString('en-IN');
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { date: dateKey, count: 0 };
    }
    dailyData[dateKey].count += 1;
  });

  const chartData = Object.values(dailyData).slice(-7); // Last 7 days

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="orders-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Per Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData.length > 0 ? chartData : [{ date: 'No Data', count: 0 }]}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '12px', fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '12px', fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProductDistributionChart({ products = [] }: { products?: any[] }) {
  // Get product distribution from actual products
  const productData = products.map((p: any) => ({
    name: p.name,
    value: p.stock || 0,
  })).slice(0, 5);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (productData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="product-distribution-chart">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Stock Distribution</h3>
        <div className="h-80 flex items-center justify-center text-gray-400">
          No products available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="product-distribution-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Stock Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={productData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {productData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} units`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeliveryPerformanceChart({ orders = [] }: { orders?: any[] }) {
  // Calculate delivery performance from orders
  const deliveryStats: any = { onTime: 0, delayed: 0, pending: 0 };
  
  orders.forEach((order: any) => {
    const status = order.status?.toLowerCase();
    if (status === 'delivered') {
      deliveryStats.onTime += 1; // Assuming delivered = on time for now
    } else if (status === 'pending') {
      deliveryStats.pending += 1;
    } else {
      deliveryStats.delayed += 1;
    }
  });

  const total = Object.values(deliveryStats).reduce((a: number, b: number) => a + b, 0) || 1;
  const chartData = [
    { name: 'On Time', value: (deliveryStats.onTime / total * 100).toFixed(0), orders: deliveryStats.onTime },
    { name: 'Delayed', value: (deliveryStats.delayed / total * 100).toFixed(0), orders: deliveryStats.delayed },
    { name: 'Pending', value: (deliveryStats.pending / total * 100).toFixed(0), orders: deliveryStats.pending },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="delivery-performance-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  item.name === 'On Time' ? 'bg-green-500' :
                  item.name === 'Delayed' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.orders} orders</p>
          </div>
        ))}
      </div>
    </div>
  );
}
