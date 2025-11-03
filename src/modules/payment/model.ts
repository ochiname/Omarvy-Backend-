// src/modules/payment/model.ts
import { Knex } from "knex";
import { PaymentData } from "./interface";

export class PaymentModel {
  constructor(private db: Knex) {}

  async createPayment(data: PaymentData): Promise<PaymentData[]> {
    return this.db("payments")
    .insert(data)
    .returning("*");
  }

  async getPaymentByReference(reference: string): Promise<PaymentData | undefined> {
    return this.db("payments")
    .where({ payment_reference: reference })
    .first();
  }

  async updatePaymentStatus(reference: string, status: string, paid_at?: Date) {
    return this.db("payments")
      .where({ payment_reference: reference })
      .update({
        status,
        paid_at: paid_at ?? new Date(),
        updated_at: new Date(),
      });
  }
}
