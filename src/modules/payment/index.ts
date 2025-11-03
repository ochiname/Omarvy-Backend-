// src/modules/payment/index.ts
import express from "express";
import { PaymentController } from "./controller";
import { PaymentValidator } from "./validator";
import { authenticateToken } from "../../middlewares/jwt_aunthenticator";

const paymentRouter = express.Router();
const controller = new PaymentController();

paymentRouter.post("/initialize/payment", authenticateToken, PaymentValidator.validate(PaymentValidator.initializePaymentSchema),
  controller.controller_initializePayment.bind(controller)
);

paymentRouter.post("/verify/payment", authenticateToken, PaymentValidator.validate(PaymentValidator.verifyPaymentSchema),
  controller.controller_verifyPayment.bind(controller)
);

export default paymentRouter;
