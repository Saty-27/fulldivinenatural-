import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: any[];
}

const orderColumns = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('customerName')}</div>
        <div className="text-xs text-gray-500">{row.original.customerEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }: any) => {
      const items = row.getValue('items') as any[];
      return (
        <div className="text-sm">
          {items && items.length > 0 ? (
            <div>
              <div className="font-medium">{items[0]?.productName}</div>
              {items.length > 1 && (
                <div className="text-xs text-gray-500">+{items.length - 1} more</div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">No items</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }: any) => {
      const items = row.getValue('items') as any[];
      const totalQty = items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
      return <div className="text-sm font-medium">{totalQty}L</div>;
    },
  },
  {
    accessorKey: 'total',
    header: 'Amount',
    cell: ({ row }: any) => (
      <div className="text-sm font-semibold text-green-600">
        ₹{row.getValue('total')?.toLocaleString() || '0'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
        processing: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
      };
      
      return (
        <Badge 
          className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'} border`}
          data-testid={`status-${status}`}
        >
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Delivery Date',
    cell: ({ row }: any) => {
      const date = row.getValue('deliveryDate') as string;
      return (
        <div className="text-sm text-gray-600">
          {date ? new Date(date).toLocaleDateString('en-IN') : 'Not scheduled'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          data-testid={`view-order-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`order-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  // Get recent orders (last 10)
  const recentOrders = Array.isArray(orders) ? orders.slice(-10).reverse() : [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="recent-orders-table">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
          View All Orders
        </Button>
      </div>
      
      <DataTable
        columns={orderColumns}
        data={recentOrders}
        searchPlaceholder="Search orders..."
      />
    </div>
  );
}