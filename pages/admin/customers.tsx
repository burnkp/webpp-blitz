import { useState, useEffect } from 'react';
import { getCustomers } from '@/lib/supabase';
import { Customer } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const fetchedCustomers = await getCustomers();
    setCustomers(fetchedCustomers);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Customers</h1>
      <div className="grid gap-6">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {customer.email}</p>
              <p>Company: {customer.company_name}</p>
              <p>NUI: {customer.company_nui}</p>
              <p>Phone: {customer.phone}</p>
              <p>City: {customer.city}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}