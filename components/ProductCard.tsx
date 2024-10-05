import { Product } from '@/types/supabase'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useCart } from '@/lib/cartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative mb-4">
          <Image
            src={product.image_url || '/placeholder.svg'}
            alt={product.name || 'Product image'}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <p className="text-sm text-gray-500 mb-2">{product.description}</p>
        <p className="font-bold">${product.price?.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}