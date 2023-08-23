import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";
import { PaymentFunc, PaymentId } from "../types/PaymentTypes";
import {
  PaymentIntentSchema,
  AttachPaymentIntentSchema,
} from "../types/SchemaTypes";
import { parse } from "../types/ResponseTypes";

import {
  createPaymentIntent,
  attachPaymentIntent,
  retrievePaymentIntent,
} from "../services/PaymentIntent";

export const addPaymentIntent: PaymentFunc = async (req, res, next) => {
  try {
    const payment = await createPaymentIntent(
      PaymentIntentSchema.parse(req.body)
    );

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

export const getPaymentIntent: PaymentFunc = async (req, res, next) => {
  try {
    if (!req.query.payment_id) {
      return next(new AppError("Payment ID is required", 400));
    }
    const payment = await retrievePaymentIntent(
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

export const addAttachPaymentIntent: PaymentFunc = async (req, res, next) => {
  try {
    const payment = await attachPaymentIntent(
      PaymentId.parse(req.query.payment_intent_id),
      AttachPaymentIntentSchema.parse(req.body)
    );

    console.log(payment);

    if (payment.code) {
      if (payment.code.includes("parameter_attached_state")) {
        return next(new AppError(payment.detail, 400));
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
