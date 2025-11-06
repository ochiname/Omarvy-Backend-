// src/modules/payment/service.ts
import axios from "axios";
import dotenv from "dotenv";
import { PaymentModel } from "./model";
import { AuthModel } from "../admin auth/model";
import { PaymentRequest, PaymentVerification, PaymentResponse } from "./interface";
import { errors } from '../../middlewares/error';
import { CartService } from "../cart/service";
import { OrderService } from "../order/service";


dotenv.config();

export class PaymentService {
  constructor(private model: PaymentModel) {}
  private AuthModel = new AuthModel();
  private cartService = new CartService();
  private OrderService = new OrderService();

  // Initialize payment
  async service_initializePayment(data: PaymentRequest): Promise<PaymentResponse> {
    const reference = `REF-${Date.now()}`;
    const provider = data.provider;

    const user = await this.AuthModel.model_getUserById(data.userId);
    if (!user) {
      throw errors.NOT_FOUND;
    }

    const finalTotal = await this.cartService.service_calculateFinalTotal(
      data.cartId,       // user's cart ID
      data.deliveryId  // delivery fee selected
    );
    // Create pending record in DB
    await this.model.createPayment({
      user_id: data.userId,
      amount: finalTotal,
      provider,
      payment_reference: reference,
      status: "pending",
    });

    // Example: Paystack
    if (provider === "paystack") {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: "user@email.com", // you can fetch real user email
          amount: data.amount * 100, // convert to kobo
          reference,
        },
        {
          headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        }
      );

      return {
        status: "success",
        message: "Payment initialized",
        paymentUrl: response.data.data.authorization_url,
        payment_reference: reference,
      };
    }
    // Example: Flutterwave
    else if (provider === "flutterwave") {
      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref: reference,
          amount: data.amount,
          currency: "NGN", // or "USD" or "GHS" depending on your account setup
          redirect_url: "https://your-frontend.com/payment-success", // your redirect URL
          customer: {
            email: user.email || "no email",
            name: user.full_name || "No Name",
            phone_number: user.phone || "no phone", 
          },
          customizations: {
            title: "Your Business Name",
            description: "Payment for services",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
    );

  return {
    status: "success",
    message: "Payment initialized",
    paymentUrl: response.data.data.link, // ✅ This is the official Flutterwave checkout URL
    payment_reference: reference,
  };
}

    // Example: Stripe
    else if (provider === "stripe") {
      const response = await axios.post(
        "https://api.stripe.com/v1/charges",
        {
          amount: data.amount * 100, // convert to cents
          currency: "usd",
          source: "tok_visa", // you can fetch real token
        },
        {
          headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
        }
      );

      return {
        status: "success",
        message: "Payment initialized",
        paymentUrl: response.data.url,
        payment_reference: response.data.id,
      };
    }   

    // Paypal
    else if (provider === "paypal") {
      const response = await axios.post(    
        "https://api-m.sandbox.paypal.com/v2/checkout/orders",
        {
          intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: data.amount.toFixed(2),
                    },
                },  
            ],
        },
        {
          headers: { 
            Authorization: `Bearer ${process.env.PAYPAL_CLIENT_SECRET}`,    
            "Content-Type": "application/json",
            },
        }
        );
        const approvalUrl = response.data.links.find((link: any) => link.rel === "approve")?.href;

        return {
            status: "success",
            message: "Payment initialized",
            paymentUrl: approvalUrl,
            payment_reference: reference,
        };
    }
    

    // Other providers can go here...
    return { status: "failed", message: "Unsupported payment provider" };
  }

  // Verify payment
  async service_verifyPayment(data: PaymentVerification): Promise<PaymentResponse> {
  let verificationData: any = null;

  try {
    // ✅ PAYSTACK VERIFICATION
    if (data.provider === "paystack") {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${data.payment_reference}`,
        {
          headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        }
      );

      verificationData = response.data.data;

      if (verificationData.status === "success") {
        await this.model.updatePaymentStatus(
          data.payment_reference,
          "success",
          new Date(verificationData.paid_at)
        );
        await this.OrderService.service_createOrderAfterPaymentVerification(
          data.userId,             // userId
          data.payment_reference,   // paymentReference
          data.deliveryFeeId,     // deliveryFeeId
          data.deliveryAddress,    // deliveryAddress
          data.city                 // city
        );


      } else {
        await this.model.updatePaymentStatus(data.payment_reference, "failed");
      }

      return {
        status: verificationData.status,
        message: "Paystack payment verification completed.",
        data: verificationData,
      };
    }

    // ✅ FLUTTERWAVE VERIFICATION
    else if (data.provider === "flutterwave") {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${data.payment_reference}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      verificationData = response.data.data;

      if (!verificationData) {
        return { status: "failed", message: "Unable to verify Flutterwave payment." };
      }

      if (verificationData.status === "successful") {
        await this.model.updatePaymentStatus(
          data.payment_reference,
          "success",
          new Date(verificationData.created_at || new Date())
        );

         await this.OrderService.service_createOrderAfterPaymentVerification(
          data.userId,             // userId
          data.payment_reference,   // paymentReference
          data.deliveryFeeId,     // deliveryFeeId
          data.deliveryAddress,    // deliveryAddress
          data.city                 // city
        );
        
      } else {
        await this.model.updatePaymentStatus(data.payment_reference, "failed");
      }

      return {
        status: verificationData.status === "successful" ? "success" : "failed",
        message:
          verificationData.status === "successful"
            ? "Flutterwave payment verified successfully."
            : "Flutterwave payment not successful.",
        data: verificationData,
      };
    }

    // ✅ STRIPE OR OTHER PROVIDERS
    else {
      return { status: "failed", message: "Unsupported payment provider." };
    }
  } catch (error: any) {
    console.error("Payment verification error:", error.response?.data || error.message);

    return {
      status: "failed",
      message: "Error verifying payment.",
      data: error.response?.data || error.message,
    };
  }
}
}
