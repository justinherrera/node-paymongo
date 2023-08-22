import { z } from "zod";

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

export const PaymentTypeSchema = z.object({
  type: z.string(),
});

export const SourceSchema = z.object({
  amount: z.number(),
  redirect: z.object({
    success: z.string(),
    failed: z.string(),
  }),
  type: z.string(),
  currency: z.string(),
});
