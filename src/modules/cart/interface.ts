export interface NewCarts {
  id: string;
  user_id: string;
  updated_at: Date;
  created_at: Date;
}

export type UpdateCarts = Omit<NewCarts, 
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