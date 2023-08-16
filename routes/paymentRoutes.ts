import express, { Request, Response } from "express";
import { addCheckout, getCheckout } from "../controllers/PaymentController";

const router = express.Router();

router.post("/create-checkout", addCheckout);
router.get("/retrieve-checkout", getCheckout);
// .get("/", getProducts);
// router
//   .patch("/:productId", updateProduct)
//   .delete("/:productId", deleteProduct)
//   .get("/:productId", getProduct);

export default router;
