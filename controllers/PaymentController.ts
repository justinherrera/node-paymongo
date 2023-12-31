import { PaymentFunc } from "../types/PaymentTypes";
import { PaymentSchema } from "../types/SchemaTypes";
import { parse } from "../types/ResponseTypes";

import { createPayment } from "../services/Payment";
import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";

export const addPayment: PaymentFunc = async (req, res, next) => {
  try {
    const payment = await createPayment(PaymentSchema.parse(req.body));

    // the source id needs to be authorize first
    if (payment.code) {
      if (payment.code.includes("resource_not_chargeable_state")) {
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
