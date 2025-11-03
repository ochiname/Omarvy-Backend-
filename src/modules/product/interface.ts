export interface NewProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock_quantity: number;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export type UpdateProduct = Omit<NewProduct, 
    'id' >;


