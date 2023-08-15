import express, { Request, Response } from "express";
import { addCheckout } from "../controllers/PaymentController";

const router = express.Router();

router.post("/", addCheckout);
// .get("/", getProducts);
// router
//   .patch("/:productId", updateProduct)
//   .delete("/:productId", deleteProduct)
//   .get("/:productId", getProduct);

export default router;
