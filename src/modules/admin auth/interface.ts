export type Role = 'customer' | 'admin';
// export type AccountStatus = 'active' | 'disabled' | 'suspended';

export interface NewUser {
  id: string;
  role: Role;
  full_name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  // account_status: AccountStatus;
  created_at: Date;
}

export type UpdateUser = Omit<NewUser, 
    'id' >;


