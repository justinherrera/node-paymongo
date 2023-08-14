import { z } from "zod";
import express, { NextFunction, Request, Response } from "express";

export type CartFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const nameLength: number = 5 as const;
const minQuantity: number = 1 as const;
const minPrice: number = 10 as const;

export const CartSchema = z
  .object({
    name: z.string().min(5).max(100),
    description: z.string().optional(),
    quantity: z.number().min(1),
    price: z.number().min(10),
  })
  .refine(({ name }) => name.length >= nameLength, {
    message: "Product name must be more than 5 characters long",
    path: ["path"],
  })
  .refine(({ quantity }) => quantity >= minQuantity, {
    message: "Quantity must be atleast 1",
    path: ["quantity"],
  })
  .refine(({ price }) => price >= minPrice, {
    message: "The product's amount must be equal to or greater than 10",
    path: ["price"],
  });

// export const CartBody = z
//   .object({
//     name: z.string().min(5, { message: "Must be 5 or more characters long" }),
//     description: z
//       .string()
//       .min(5, { message: "Must be 5 or more characters long" }),
//     quantity: z.number().default(1),
//     price: z.number().gte(10, { message: "Must be atleast 10" }),
//   })
//   .strict();

export const { parse } = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    data: z.union([z.array(CartSchema), CartSchema]),
  }),
  z.object({
    status: z.literal("failed"),
    error: z.instanceof(Error).or(z.string()),
  }),
]);
