import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createOrder } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/cartContext';

export default function Cart() {
  const { cart, updateQuantity, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    company_name: '',
    company_nui: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleSubmitOrder = async () => {
    try {
      const orderInput = {
        customer_name: customerInfo.name,
        company_name: customerInfo.company_name,
        company_nui: customerInfo.company_nui,
        email: customerInfo.email,
        total_price: cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
        status: 'Submitted',
        products: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          subtotal: (item.price || 0) * item.quantity,
        })),
      };

      await createOrder(orderInput);
      clearCart();
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <span>{item.name}</span>
                <div>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-20 mr-2"
                  />
                  <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-between">
            <span className="font-bold">Total:</span>
            <span className="font-bold">
              ${cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toFixed(2)}
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
              <Input
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <Input
                name="company_name"
                value={customerInfo.company_name}
                onChange={handleInputChange}
                placeholder="Company Name"
                required
              />
              <Input
                name="company_nui"
                value={customerInfo.company_nui}
                onChange={handleInputChange}
                placeholder="Company NUI"
                required
              />
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitOrder} className="w-full">
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}