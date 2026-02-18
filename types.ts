
export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  imageUrl: string;
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  resellerId?: string; // Optional for assigning to resellers
}

export interface Reseller {
  id: string;
  name: string;
  totalSales: number;
  commissionRate: number;
  commissionEarned: number;
  avatarUrl: string;
}

export enum AiContentType {
  LIVE_SCRIPT = 'Live Script Generator',
  SALES_CAPTION = 'Sales Caption Generator',
  OBJECTION_HANDLING = 'Objection Handling',
}
