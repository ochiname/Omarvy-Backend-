export interface NewCategory {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export type UpdateCategory = Omit<NewCategory, 
    'id' >;


