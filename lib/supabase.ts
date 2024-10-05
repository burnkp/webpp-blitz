import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Customer, Order, Product } from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('Products')
    .select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  console.log('Creating product with data:', productData)
  const { data, error } = await supabase
    .from('Products')
    .insert([{
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();
  if (error) {
    console.error('Error creating product:', error)
    throw new Error(`Failed to create product: ${error.message}`)
  }
  if (!data || data.length === 0) {
    console.error('No data returned after creating product')
    throw new Error('No data returned after creating product')
  }
  console.log('Product created successfully:', data[0])
  return data[0]
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('Products')
    .update(productData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Customers
export const createCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('Customers')
    .insert([customerData])
    .select();
  if (error) throw error;
  return data[0];
};

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('Customers')
    .select('*');
  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data || [];
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const { data, error } = await supabase
    .from('Customers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Orders
export const createOrder = async (orderInput: any): Promise<{ order: Order, orderProducts: any }> => {
  const { data: customerData, error: customerError } = await supabase
    .from('Customers')
    .insert([{
      name: orderInput.customer_name,
      company_name: orderInput.company_name,
      company_nui: orderInput.company_nui,
      email: orderInput.email,
      created_at: new Date().toISOString()
    }])
    .select()

  if (customerError) throw customerError

  const customer_id = customerData[0].id

  const { data: createdOrderData, error: orderError } = await supabase
    .from('Orders')
    .insert([{
      customer_id: customer_id,
      total_price: orderInput.total_price,
      order_status: orderInput.status,
      created_at: new Date().toISOString()
    }])
    .select()

  if (orderError) throw orderError

  const order_id = createdOrderData[0].id

  const orderProductsInput = orderInput.products.map((product: any) => ({
    order_id: order_id,
    product_id: product.product_id,
    quantity: product.quantity,
    package_size: product.package_size,
    subtotal: product.subtotal
  }))

  const { data: createdOrderProductsData, error: orderProductsError } = await supabase
    .from('OrderProducts')
    .insert(orderProductsInput)

  if (orderProductsError) throw orderProductsError

  return { order: createdOrderData[0], orderProducts: createdOrderProductsData }
};

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('Orders')
    .select(`
      *,
      Customers (name, email),
      Products (name, price)
    `);
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data || [];
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('Orders')
    .update({ order_status: status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

// Image upload
export const uploadProductImage = async (file: File): Promise<string> => {
  console.log('Uploading product image:', file.name)
  const fileName = `${uuidv4()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  if (error) {
    console.error('Error uploading image:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
  const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
  console.log('Image uploaded successfully:', publicUrlData.publicUrl)
  return publicUrlData.publicUrl
};

export const getProductImageUrl = (path: string): string => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
};

// Dashboard KPIs
export const getDashboardKPIs = async (): Promise<{ totalRevenue: number, totalOrders: number, averageOrderValue: number }> => {
  const { data: orders, error: ordersError } = await supabase
    .from('Orders')
    .select(`
      *,
      Products (name, price)
    `);
  
  if (ordersError) throw ordersError;

  const totalRevenue = orders.reduce((sum: number, order: any) => {
    const price = order.Products?.price || 0;
    return sum + (order.quantity * price);
  }, 0);
  
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue
  };
};