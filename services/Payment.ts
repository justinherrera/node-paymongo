import axios from "axios";
import { PaymentMethods } from "../types/PaymentTypes";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || "";
const PAYMONGO_BASE_URL = process.env.PAYMONGO_BASE_URL || "";

const base64SecretKey = Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString(
  "base64"
);
const authorizationHeaderValue = `Basic ${base64SecretKey}`;

type PaymentItems = {
  amount: number;
  currency: string;
  source: {
    id: string;
    type: string;
  };
};

type ErrorResponse = {
  code: string;
  detail: string;
};
export const createPayment = async (items: PaymentItems) => {
  const options = {
    method: "POST",
    url: `${PAYMONGO_BASE_URL}/payments`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: authorizationHeaderValue,
    },
    data: {
      data: {
        attributes: items,
      },
    },
  };

  return await axios
    .request(options)
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error): ErrorResponse {
      // console.error(error.response.data.errors);
      const { code, detail } = error.response.data.errors[0];
      //   console.log(error.response.data.errors[0]);
      return {
        code,
        detail,
      };
    });
};
