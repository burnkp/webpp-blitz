import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/supabase';
import { Order } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Customer: {order.Customers?.name}</p>
              <p>Total: ${order.total_price}</p>
              <p>Status: {order.order_status}</p>
              <Select
                value={order.order_status}
                onValueChange={(value) => handleStatusChange(order.id, value)}
              >
                <option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}