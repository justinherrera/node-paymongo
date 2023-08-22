import express, { Request, Response } from "express";
import {
  addCheckout,
  getCheckout,
  deleteCheckout,
  addPayment,
  getPayment,
  addPaymentMethod,
} from "../controllers/PaymentController";

const router = express.Router();

// checkout
router.post("/create-checkout", addCheckout);
router.get("/retrieve-checkout", getCheckout);
router.get("/expire-checkout", deleteCheckout);

// payments
router.post("/create-payment", addPayment);
router.get("/retrieve-payment", getPayment);

// routes
router.post("/create-payment-method", addPaymentMethod);
// .get("/", getProducts);
// router
//   .patch("/:productId", updateProduct)
//   .delete("/:productId", deleteProduct)
//   .get("/:productId", getProduct);

export default router;
