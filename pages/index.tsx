import { useEffect, useState } from 'react'
import { getProducts } from '@/lib/supabase'
import { Product } from '@/types/supabase'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
    }
    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">CASTROL Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}