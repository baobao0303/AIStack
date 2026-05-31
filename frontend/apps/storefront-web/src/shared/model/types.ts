// Centralized Type Definitions (FSD Shared Models segment)

export type ViewType = 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking' | 'login';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  woolType: string;
  description: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customColor: string;
  chestWidth: string;
  sleeveLength: string;
  height: string;
  customNotes: string;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  status: 'received' | 'knitting' | 'completed' | 'shipping' | 'success';
  date: string;
}
