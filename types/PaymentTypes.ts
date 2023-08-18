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

export enum PaymentMethods {
  Atome = "atome",
  Card = "card",
  Dob = "dob",
  Paymaya = "paymaya",
  Billease = "billease",
  Gcash = "gcash",
  GrabPay = "grab_pay",
}

export const CheckoutResponse = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    billing: z.object({
      address: z.object({}),
      email: z.null(),
      name: z.null(),
      phone: z.null(),
    }),
    billing_information_fields_editable: z.string(),
    cancel_url: z.null(),
    checkout_url: z.string().url(),
    client_key: z.string(),
    customer_email: z.nullable(z.string()),
    description: z.nullable(z.string()),
    line_items: z.array(z.object({})),
    livemode: z.boolean(),
    merchant: z.string(),
    // origin: z.null(),
    payments: z.array(z.object({})),
    payment_intent: z.object({
      id: z.string(),
      type: z.string(),
      attributes: z.object({}),
    }),
    payment_method_types: z.array(z.string()),
    reference_number: z.null(),
    send_email_receipt: z.boolean(),
    show_description: z.boolean(),
    show_line_items: z.boolean(),
    status: z.string(),
    success_url: z.null(),
    created_at: z.number(),
    updated_at: z.number(),
    metadata: z.null(),
  }),
});

export const PaymentResponse = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    amount: z.number(),
    capture_type: z.string(),
    client_key: z.string(),
    currency: z.string().max(3),
    description: z.nullable(z.string()),
    livemode: z.boolean(),
    statement_descriptor: z.string(),
    status: z.string(),
    last_payment_error: z.nullable(z.string()),
    payment_method_allowed: z.array(z.string()),
    payments: z.array(z.string()),
    next_action: z.nullable(z.string()),
    payment_method_options: z.nullable(
      z.object({
        card: z.object({
          request_three_d_secure: z.string(),
        }),
      })
    ),
    metadata: z.nullable(z.string()),
    setup_future_usage: z.nullable(z.string()),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});
export type PaymentResult = z.infer<typeof PaymentResponse>;
export type CheckoutResult = z.infer<typeof CheckoutResponse>;

export const CheckoutSessionId = z.string();
export const PaymentId = z.string();
export const CheckoutSchema = z
  .object({
    name: z.string().min(5),
    currency: z.string().max(3),
    amount: z.number(),
    quantity: z.number().min(1).max(1000000000),
    payment_method_types: z.array(z.string()),
  })
  .required();

export const PaymentSchema = z
  .object({
    amount: z.number(),
    payment_method_allowed: z.array(z.string()),
    payment_method_options: z.object({
      card: z.object({ request_three_d_secure: z.string() }),
    }),
    currency: z.string().max(3),
    capture_type: z.string(),
  })
  .required();

export const { parse } = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    data: z.union([CheckoutResponse, PaymentResponse]),
    // data: PaymentResponse,
  }),
  z.object({
    status: z.literal("failed"),
    error: z.instanceof(Error).or(z.string()),
  }),
]);
