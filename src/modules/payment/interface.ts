// src/modules/payment/interface.ts

export interface PaymentData {
  id?: string;
  user_id: string;
  order_id?: string | null;
  amount: number;
  provider: "paystack" | "flutterwave" | "stripe" | "paypal";
  payment_reference: string;
  status?: "success" | "failed" | "pending";
  paid_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  provider: "paystack" | "flutterwave" | "stripe" | "paypal";
  cartId: string;          // ✅ add this
  deliveryId: string; 
}

export interface PaymentVerification {
  payment_reference: string;
  provider: "paystack" | "flutterwave" | "stripe" | "paypal";
  userId: string;
  deliveryFeeId: string;
  deliveryAddress: string;
  city: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
  paymentUrl?: string;
  payment_reference?: string;
  data?: any;
}
