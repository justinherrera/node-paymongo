import { PaymentFunc } from "../types/PaymentTypes";
import { SourceSchema } from "../types/SchemaTypes";
import { parse } from "../types/ResponseTypes";

import { createSource } from "../services/PaymentSource";
import { AppError } from "../middlewares/ErrorHandler";
import { z } from "zod";

export const addSource: PaymentFunc = async (req, res, next) => {
  try {
    const source = await createSource(SourceSchema.parse(req.body));

    if (source.code) {
      if (source.detail.includes("payment_method_type")) {
        return next(new AppError("Invalid Payment Method", 400));
      }
    }

    console.log(source);
    res.status(200).json(
      parse({
        status: "success",
        data: source,
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
