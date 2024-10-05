import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, uploadProductImage } from '@/lib/supabase';
import { Product } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    package_size: 0,
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadProductImage(image);
      }
      const createdProduct = await createProduct({ ...newProduct, image_url: imageUrl });
      setProducts([...products, createdProduct]);
      setNewProduct({ name: '', description: '', price: 0, package_size: 0 });
      setImage(null);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
              <Textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Product Description"
                required
              />
              <Input
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
              />
              <Input
                name="package_size"
                type="number"
                value={newProduct.package_size}
                onChange={handleInputChange}
                placeholder="Package Size"
                required
              />
              <Input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.id} className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <span>${product.price}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}