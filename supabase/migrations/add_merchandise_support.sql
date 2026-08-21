-- Add tshirt_color column to registrations table
ALTER TABLE registrations
ADD COLUMN tshirt_color VARCHAR(20);

-- Create merchandise products table
CREATE TABLE IF NOT EXISTS merchandise_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_naira INTEGER NOT NULL DEFAULT 0,
  sizes TEXT[] NOT NULL DEFAULT ARRAY['M', 'L', 'XL', '2XL'],
  colors TEXT[] NOT NULL DEFAULT ARRAY['black', 'white'],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create merchandise orders table
CREATE TABLE IF NOT EXISTS merchandise_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES merchandise_products(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  size VARCHAR(20) NOT NULL,
  color VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price_naira INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_merch_orders_email ON merchandise_orders(customer_email);
CREATE INDEX idx_merch_orders_status ON merchandise_orders(status);
CREATE INDEX idx_merch_orders_created ON merchandise_orders(created_at);

-- Insert the default AIDIFILN t-shirt product
INSERT INTO merchandise_products (name, description, price_naira, sizes, colors, active)
VALUES (
  'AIDIFILN T-Shirt',
  'Official AIDIFILN 2026 t-shirt with front and back design',
  5000,
  ARRAY['M', 'L', 'XL', '2XL'],
  ARRAY['black', 'white'],
  true
);

-- Add RLS policies for merchandise tables
ALTER TABLE merchandise_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read products" ON merchandise_products
FOR SELECT USING (active = true);

-- Allow public insert to orders (for new orders)
CREATE POLICY "Allow public insert orders" ON merchandise_orders
FOR INSERT WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "Allow users view own orders" ON merchandise_orders
FOR SELECT USING (true);
