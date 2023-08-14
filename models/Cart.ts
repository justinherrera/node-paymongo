import { Schema, model, InferSchemaType } from "mongoose";

const cartSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 100,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 10,
  },
});

type CartType = InferSchemaType<typeof cartSchema>;

const Cart = model<CartType>("Cart", cartSchema);

export default Cart;
