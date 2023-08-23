import express, { Request, Response } from "express";
import { addPayment } from "../controllers/PaymentController";

import {
  addPaymentMethod,
  getPaymentMethod,
} from "../controllers/PaymentMethod";

import {
  addCheckout,
  getCheckout,
  deleteCheckout,
} from "../controllers/PaymentCheckout";

import {
  addPaymentIntent,
  getPaymentIntent,
  addAttachPaymentIntent,
} from "../controllers/PaymentIntentController";

import { addSource } from "../controllers/PaymentSource";

const router = express.Router();

// checkout
router.post("/create-checkout", addCheckout);
router.get("/retrieve-checkout", getCheckout);
router.get("/expire-checkout", deleteCheckout);

// payment intents
router.post("/create-payment-intent", addPaymentIntent);
router.get("/retrieve-payment-intent", getPaymentIntent);
router.post("/attach-payment-intent", addAttachPaymentIntent);

// payment methods
router.post("/create-payment-method", addPaymentMethod);
router.get("/retrieve-payment-method", getPaymentMethod);

// source
router.post("/create-source", addSource);

// payments
router.post("/create-payment", addPayment);

// .get("/", getProducts);
// router
//   .patch("/:productId", updateProduct)
//   .delete("/:productId", deleteProduct)
//   .get("/:productId", getProduct);

export default router;
