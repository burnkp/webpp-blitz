import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
      }
    };
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products">
          <Card>
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Add, edit, or remove products</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View and update order statuses</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/customers">
          <Card>
            <CardHeader>
              <CardTitle>Manage Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View customer information</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}