import { z } from "zod";
import express, { NextFunction, Request, Response } from "express";

export type PaymentFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// enum PaymentMethod {
//   BILLEASE = "billease",
//   CARD = "card",
//   DOB = "dob",
//   DOB_UBP = "dob_ubp",
//   GCASH = "gcash",
//   GRAB_PAY = "grab_pay",
//   PAYMAYA = "paymaya",
// }

export const CheckoutResponse = z.object({
  client_key: z.string(),
  status: z.string(),
  billing: z.object({
    email: z.nullable(z.string()),
    name: z.nullable(z.string()),
    phone: z.nullable(z.string()),
  }),
  payment_intent_id: z.string(),
  line_items: z.object({
    name: z.string(),
    quantity: z.number(),
    amount: z.number(),
    currency: z.string(),
  }),
  checkout_url: z.string(),
  payment_method_types: z.array(z.string()),
  merchant: z.string(),
});

export type Result = z.infer<typeof CheckoutResponse>;

export const CheckoutSessionId = z.string();
export const PaymentSchema = z.object({
  name: z.string().min(5),
  currency: z.string().max(3),
  amount: z.number(),
  quantity: z.number().min(1).max(1000000000),
  payment_method_types: z.array(z.string()),
  //   payment_method_types: z.array(z.nativeEnum(PaymentMethod)),
});

export const { parse } = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    data: CheckoutResponse,
  }),
  z.object({
    status: z.literal("failed"),
    error: z.instanceof(Error).or(z.string()),
  }),
]);
