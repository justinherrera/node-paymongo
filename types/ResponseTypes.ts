import { z } from "zod";

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

const PaymentMethodResponse = z.object({
  id: z.string(),
  type: z.literal("payment_method"),
  attributes: z.object({
    livemode: z.boolean(),
    type: z.string(), // This can be further restricted using z.enum
    billing: z.null(),
    created_at: z.number(),
    updated_at: z.number(),
    details: z.null(),
    metadata: z.null(),
  }),
});

export const SourceResponse = z.object({
  id: z.string(),
  type: z.literal("source"),
  attributes: z.object({
    amount: z.number(),
    billing: z.null(),
    currency: z.string(),
    description: z.null(),
    livemode: z.boolean(),
    redirect: z.object({
      checkout_url: z.string().url(),
      failed: z.string().url(),
      success: z.string().url(),
    }),
    statement_descriptor: z.null(),
    status: z.string(),
    type: z.string(),
    metadata: z.null(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});

export const { parse } = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    data: z.union([
      CheckoutResponse,
      PaymentResponse,
      PaymentMethodResponse,
      SourceResponse,
    ]),
    // data: PaymentResponse,
  }),
  z.object({
    status: z.literal("failed"),
    error: z.instanceof(Error).or(z.string()),
  }),
]);
