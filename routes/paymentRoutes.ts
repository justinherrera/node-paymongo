import express, { Request, Response } from "express";
import {
  addCheckout,
  getCheckout,
  deleteCheckout,
  addPayment,
} from "../controllers/PaymentController";

const router = express.Router();

router.post("/create-checkout", addCheckout);
router.get("/retrieve-checkout", getCheckout);
router.get("/expire-checkout", deleteCheckout);
router.post("/create-payment", addPayment);
// .get("/", getProducts);
// router
//   .patch("/:productId", updateProduct)
//   .delete("/:productId", deleteProduct)
//   .get("/:productId", getProduct);

export default router;
