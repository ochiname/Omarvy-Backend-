// export type AccountStatus = 'active' | 'disabled' | 'suspended';

export interface NewDeliveryFee {
  id: string;
  location: string;
  fee: number;
  created_at: Date;
  updated_at: Date;
}

export type UpdateDeliveryFee = Omit<NewDeliveryFee, 
    'id' >;


