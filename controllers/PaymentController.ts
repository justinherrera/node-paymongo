import {
  PaymentSchema,
  PaymentFunc,
  parse,
  CheckoutResponse,
  CheckoutSessionId,
  Result,
} from "../types/PaymentTypes";
import { createCheckout, retrieveCheckout } from "../services/PaymentCheckout";
import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";

// { currency: "PHP", amount: 10000, name: "samsung", quantity: 2 }

export const addCheckout: PaymentFunc = async (req, res) => {
  try {
    console.log("---reqbody---");
    console.log(req.body);
    const checkout = await createCheckout(PaymentSchema.parse(req.body));
    console.log(checkout);

    const result: Result = {
      client_key: checkout.id,
      status: checkout.attributes.status,
      billing: {
        email: checkout.attributes.billing.email,
        name: checkout.attributes.billing.name,
        phone: checkout.attributes.billing.phone,
      },
      payment_intent_id: checkout.attributes.payment_intent.id,
      line_items: {
        name: checkout.attributes.line_items[0].name,
        quantity: checkout.attributes.line_items[0].quantity,
        amount: checkout.attributes.line_items[0].amount,
        currency: checkout.attributes.line_items[0].currency,
      },
      checkout_url: checkout.attributes.checkout_url,
      payment_method_types: checkout.attributes.payment_method_types,
      merchant: checkout.attributes.merchant,
    };

    console.log("-----");
    console.log(result);
    res.status(200).json(
      parse({
        status: "success",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error checking out:", error);
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }

    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};

export const getCheckout: PaymentFunc = async (req, res) => {
  try {
    const checkout = await retrieveCheckout(
      CheckoutSessionId.parse(req.query.checkout_session_id)
    );
    console.log(checkout);

    const result: Result = {
      client_key: checkout.id,
      status: checkout.attributes.status,
      billing: {
        email: checkout.attributes.billing.email,
        name: checkout.attributes.billing.name,
        phone: checkout.attributes.billing.phone,
      },
      payment_intent_id: checkout.attributes.payment_intent.id,
      line_items: {
        name: checkout.attributes.line_items[0].name,
        quantity: checkout.attributes.line_items[0].quantity,
        amount: checkout.attributes.line_items[0].amount,
        currency: checkout.attributes.line_items[0].currency,
      },
      checkout_url: checkout.attributes.checkout_url,
      payment_method_types: checkout.attributes.payment_method_types,
      merchant: checkout.attributes.merchant,
    };

    console.log("-----");
    console.log(result);
    res.status(200).json(
      parse({
        status: "success",
        data: result,
      })
    );

    res.status(200).json(
      parse({
        status: "success",
        data: checkout,
      })
    );
  } catch (error) {
    console.error("Error checking out:", error);
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }

    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};
