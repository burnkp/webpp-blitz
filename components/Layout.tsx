import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/cartContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { cart } = useCart();

  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            CASTROL
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/products" className="hover:text-gray-300">
              Products
            </Link>
            <Link href="/cart" className="hover:text-gray-300">
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </Link>
            {isAdminRoute && (
              <Link href="/admin/dashboard" className="hover:text-gray-300">
                Admin
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          © 2023 CASTROL. All rights reserved.
        </div>
      </footer>
    </div>
  );
}