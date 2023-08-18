import {
  CheckoutSchema,
  PaymentSchema,
  PaymentFunc,
  parse,
  CheckoutResponse,
  CheckoutSessionId,
  PaymentId,
  PaymentResult,
  CheckoutResult,
} from "../types/PaymentTypes";
import {
  createCheckout,
  retrieveCheckout,
  expireCheckout,
} from "../services/PaymentCheckout";
import { createPayment, retrievePayment } from "../services/PaymentIntent";
import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";

// { currency: "PHP", amount: 10000, name: "samsung", quantity: 2 }

export const addCheckout: PaymentFunc = async (req, res, next) => {
  try {
    const checkout = await createCheckout(CheckoutSchema.parse(req.body));
    if (checkout.code) {
      if (checkout.detail.includes("payment_method_type")) {
        return next(new AppError("Invalid Payment Method", 400));
      } else if (checkout.code.includes("parameter_below_minimum")) {
        return next(new AppError(checkout.detail, 400));
      }
    }

    res.status(200).json(
      parse({
        status: "success",
        data: checkout,
      })
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      if (error.errors[0].path) {
        const path = error.errors[0].path[0];
        res
          .status(400)
          .json(
            parse({ status: "failed", error: `Field ${path} is required` })
          );
      }
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

    res.status(200).json(
      parse({
        status: "success",
        data: checkout,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }
    // console.error("Error checking out:", error.response.data.errors);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};

export const deleteCheckout: PaymentFunc = async (req, res, next) => {
  try {
    const checkout = await expireCheckout(
      CheckoutSessionId.parse(req.query.checkout_session_id)
    );

    if (checkout.code) {
      if (checkout.detail.includes("expired")) {
        return next(new AppError("Checkout session is already expired", 400));
      }
    }

    // const result: CheckoutResult = {
    //   client_key: checkout.id,
    //   status: checkout.attributes.status,
    //   billing: {
    //     email: checkout.attributes.billing.email,
    //     name: checkout.attributes.billing.name,
    //     phone: checkout.attributes.billing.phone,
    //   },
    //   payment_intent_id: checkout.attributes.payment_intent.id,
    //   line_items: {
    //     name: checkout.attributes.line_items[0].name,
    //     quantity: checkout.attributes.line_items[0].quantity,
    //     amount: checkout.attributes.line_items[0].amount,
    //     currency: checkout.attributes.line_items[0].currency,
    //   },
    //   checkout_url: checkout.attributes.checkout_url,
    //   payment_method_types: checkout.attributes.payment_method_types,
    //   merchant: checkout.attributes.merchant,
    // };
    res.status(200).json(
      parse({
        status: "success",
        data: checkout,
      })
    );

    res.status(200).json(
      parse({
        status: "success",
        data: checkout,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }
    // console.error("Error checking out:", error.response.data.errors);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};

// Payment Intent

export const addPayment: PaymentFunc = async (req, res, next) => {
  try {
    const payment = await createPayment(PaymentSchema.parse(req.body));

    if (payment.code) {
      if (payment.detail.includes("payment_method_type")) {
        return next(new AppError("Invalid Payment Method", 400));
      }
    }

    res.status(200).json(
      parse({
        status: "success",
        data: payment,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors[0]);
      if (error.errors[0].path) {
        const path = error.errors[0].path[0];
        res
          .status(400)
          .json(
            parse({ status: "failed", error: `Field ${path} is required` })
          );
      }
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }

    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};

export const getPayment: PaymentFunc = async (req, res, next) => {
  try {
    if (!req.query.payment_id) {
      return next(new AppError("Payment ID is required", 400));
    }
    const payment = await retrievePayment(
      PaymentId.parse(req.query.payment_id)
    );

    res.status(200).json(
      parse({
        status: "success",
        data: payment,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(parse({ status: "failed", error: error.errors[0].message }));
    }
    // console.error("Error checking out:", error.response.data.errors);
    res
      .status(500)
      .json(parse({ status: "failed", error: "Internal Server Error" }));
  }
};
