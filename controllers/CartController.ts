import Cart from "../models/Cart";
import { CartFunc, CartSchema, parse } from "../types/CartTypes";
import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";

export const addProduct: CartFunc = async (req, res) => {
  try {
    const cart = new Cart(CartSchema.parse(req.body));

    await cart.save();

    console.log(cart);

    res.status(200).json(
      parse({
        status: "success",
        data: cart,
      })
    );
  } catch (error) {
    console.error("Error creating product in cart:", error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }

    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};

export const getProducts: CartFunc = async (req, res) => {
  try {
    const cart = await Cart.find({});

    res.status(200).json(
      parse({
        status: "success",
        data: cart,
      })
    );
  } catch (error) {
    console.error("Error getting products from cart:", error);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal server error" }));
  }
};

export const getProduct: CartFunc = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Cart.findById(productId);

    if (!product) {
      return next(new AppError("Product not found in cart", 400));
    }

    res.status(200).json(
      parse({
        status: "success",
        data: product,
      })
    );
  } catch (error) {
    console.error("Error updating product in cart:", error);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal server error" }));
  }
};

export const updateProduct: CartFunc = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: productId },
      { $set: { quantity } },
      { new: true }
    );

    console.log(updatedCart);

    if (!updatedCart) {
      return next(new AppError("Product not found in cart", 400));
    }

    res.status(200).json(
      parse({
        status: "success",
        data: updatedCart,
      })
    );
  } catch (error) {
    console.error("Error updating product in cart:", error);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal server error" }));
  }
};

export const deleteProduct: CartFunc = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Cart.deleteOne({ _id: productId });

    console.log(deletedProduct);
    if (deletedProduct.deletedCount === 0) {
      return next(new AppError("Product not found in cart", 400));
    }

    res.json(
      parse({
        status: "success",
        data: deletedProduct,
      })
    );
  } catch (error) {
    console.error("Error deleting product in cart:", error);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal server error" }));
  }
};
