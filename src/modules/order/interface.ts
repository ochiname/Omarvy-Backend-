export interface NewOrders {
  id: string;
  user_id: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_reference: string;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  updated_at: Date;
  created_at: Date;
}

export type UpdateOrders = Omit<NewOrders, 
    'id' >;

export interface NewCart_Item {
  id: string;
  cart_id: string;
  quantity: number;
  price: number;
  product_id: string;
  subtotal: number;
}

export type UpdateCart_Item = Omit<NewCart_Item, 
    'id' >; 


export interface AddItemResponse {
  message: string;
  cart_id?: string;
  item?: NewCart_Item;
  total?: number;
}