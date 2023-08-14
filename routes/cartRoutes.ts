import express, { Request, Response } from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controllers/CartController";

const router = express.Router();

router.post("/", addProduct).get("/", getProducts);
router
  .patch("/:productId", updateProduct)
  .delete("/:productId", deleteProduct)
  .get("/:productId", getProduct);

export default router;
