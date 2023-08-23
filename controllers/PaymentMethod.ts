import { PaymentFunc, PaymentId } from "../types/PaymentTypes";
import { PaymentTypeSchema } from "../types/SchemaTypes";
import { parse } from "../types/ResponseTypes";
import {
  createPaymentMethod,
  retrievePaymentMethod,
} from "../services/PaymentMethod";

import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";

export const addPaymentMethod: PaymentFunc = async (req, res, next) => {
  try {
    const payment = await createPaymentMethod(
      PaymentTypeSchema.parse(req.body)
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

export const getPaymentMethod: PaymentFunc = async (req, res, next) => {
  try {
    if (!req.query.payment_method_id) {
      return next(new AppError("Payment Method ID is required", 400));
    }

    console.log(req.query.payment_method_id);
    const payment = await retrievePaymentMethod(
      PaymentId.parse(req.query.payment_method_id)
    );

    console.log(payment);

    res.status(200).json(
      parse({
        status: "success",
        data: payment,
      })
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      console.log("zod error");
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
