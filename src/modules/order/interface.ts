export interface NewOrders {
  id: string;
  user_id: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_reference: string;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address: string;
  city: string;
  delivery_fee_id: string | null;
  delivery_fee: number | null;
  updated_at: Date;
  created_at: Date;
}

export type UpdateOrders = Omit<NewOrders, 
    'id' >;

export interface NewOrder_Item {
  id: string;
  order_id: string;
  quantity: number;
  price: number;
  product_id: string;
  subtotal: number;
}

export type UpdateOrder_Item = Omit<NewOrder_Item, 
    'id' >; 


// export interface AddItemResponse {
//   message: string;
//   cart_id?: string;
//   item?: NewCart_Item;
//   total?: number;
// }