import axios from "axios";
import { PaymentMethods } from "../types/PaymentTypes";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || "";
const PAYMONGO_BASE_URL = process.env.PAYMONGO_BASE_URL || "";

const base64SecretKey = Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString(
  "base64"
);
const authorizationHeaderValue = `Basic ${base64SecretKey}`;

type IntentItems = {
  currency: string;
  amount: number;
  payment_method_allowed: string[];
  capture_type: string;
  payment_method_options: {
    card: {
      request_three_d_secure: string;
    };
  };
};

type ErrorResponse = {
  code: string;
  detail: string;
};
export const createPaymentIntent = async (items: IntentItems) => {
  const options = {
    method: "POST",
    url: `${PAYMONGO_BASE_URL}/payment_intents`,
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

export const retrievePaymentIntent = async (payment_id: string) => {
  const options = {
    method: "GET",
    url: `${PAYMONGO_BASE_URL}/payment_intents/${payment_id}`,
    headers: {
      accept: "application/json",
      authorization: authorizationHeaderValue,
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

      console.log(error.errors[0]);
      return {
        code,
        detail,
      };
    });
};
