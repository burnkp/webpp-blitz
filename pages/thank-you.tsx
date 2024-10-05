import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Thank You for Your Order!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Your order has been successfully placed.</p>
          <p className="mb-8">We'll send you an email with the order details and tracking information once it's shipped.</p>
          <Link href="/">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}