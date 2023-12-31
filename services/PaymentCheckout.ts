import axios from "axios";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || "";
const PAYMONGO_BASE_URL = process.env.PAYMONGO_BASE_URL || "";

const base64SecretKey = Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString(
  "base64"
);
const authorizationHeaderValue = `Basic ${base64SecretKey}`;

console.log(authorizationHeaderValue);

// enum PaymentMethod {
//   BILLEASE = "billease",
//   CARD = "card",
//   DOB = "dob",
//   DOB_UBP = "dob_ubp",
//   GCASH = "gcash",
//   GRAB_PAY = "grab_pay",
//   PAYMAYA = "paymaya",
// }

type CheckoutItems = {
  currency: string;
  amount: number;
  name: string;
  quantity: number;
  payment_method_types: string[];
};

type ErrorResponse = {
  code: string;
  detail: string;
};
export const createCheckout = async (items: CheckoutItems) => {
  const { payment_method_types, ...data } = items;
  const options = {
    method: "POST",
    url: `${PAYMONGO_BASE_URL}/checkout_sessions`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: authorizationHeaderValue,
    },
    data: {
      data: {
        attributes: {
          send_email_receipt: false,
          show_description: false,
          show_line_items: true,
          line_items: [
            {
              name: data.name,
              currency: data.currency,
              amount: data.amount,
              quantity: data.quantity,
            },
          ],
          payment_method_types,
        },
      },
    },
  };

  return await axios
    .request(options)
    .then(function (response) {
      console.log(response.data.data);
      return response.data.data;
    })
    .catch(function (error): ErrorResponse {
      // console.error(error.response.data.errors);
      const { code, detail } = error.response.data.errors[0];
      console.log(error.response.data.errors[0]);
      return {
        code,
        detail,
      };
    });
};

export const retrieveCheckout = async (checkout_session_id: string) => {
  const options = {
    method: "GET",
    url: `${PAYMONGO_BASE_URL}/checkout_sessions/${checkout_session_id}`,
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
      console.log("error");
      console.log(error);
      console.log(error.response.data.errors[0]);
      return {
        code,
        detail,
      };
    });
};

export const expireCheckout = async (checkout_session_id: string) => {
  const options = {
    method: "POST",
    url: `${PAYMONGO_BASE_URL}/checkout_sessions/${checkout_session_id}/expire`,
    headers: {
      accept: "application/json",
      authorization: authorizationHeaderValue,
    },
  };

  console.log(options);

  return await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      console.log("success");
      return response.data.data;
    })
    .catch(function (error): ErrorResponse {
      // console.error(error.response.data.errors);
      console.log("error");
      const { code, detail } = error.response.data.errors[0];
      console.log(error.response.data.errors[0]);
      return {
        code,
        detail,
      };
    });
};
