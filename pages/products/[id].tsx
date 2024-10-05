import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProductById } from '@/lib/supabase';
import { Product } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square relative">
            <Image
              src={product.image_url || '/placeholder.svg'}
              alt={product.name || 'Product image'}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <p className="text-lg mb-4">{product.description}</p>
            <p className="text-2xl font-bold mb-4">${product.price?.toFixed(2)}</p>
            <p className="mb-4">Package Size: {product.package_size}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add to Cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
}