import express, { Request, Response } from "express";
import {
  addCheckout,
  getCheckout,
  deleteCheckout,
  addPaymentIntent,
  getPaymentIntent,
  addPaymentMethod,
  getPaymentMethod,
  addSource,
  addPayment,
} from "../controllers/PaymentController";

const router = express.Router();

// checkout
router.post("/create-checkout", addCheckout);
router.get("/retrieve-checkout", getCheckout);
router.get("/expire-checkout", deleteCheckout);

// payment intents
router.post("/create-payment-intent", addPaymentIntent);
router.get("/retrieve-payment-intent", getPaymentIntent);

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
