// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { handleError } from "../../../../app/helpers/utils";

type FlutterwaveRequest = {
  tx_ref: string;
  amount: string;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name?: string;
    phonenumber?: string;
  };
  session_duration?: string;
  max_retry_attempt?: string;
  customizations?: {
    title?: string;
    logo?: string;
    description?: string;
  };
  meta?: object;
  payment_plan?: string;
  subaccounts?: object[];
  payment_options?: string;
};

type FlutterwaveResponse =
  | { response: "success"; message: string; data: { link: string } }
  | { response: "error"; error_code: number; message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlutterwaveResponse | { error: string }>
) {
  const { amount, name, id, basePath, email, phonenumber } = req.body;
  try {
    const parsed: FlutterwaveRequest = {
      tx_ref: [new Date().getTime(), id].join("_"),
      amount: amount,
      currency: "XAF",
      redirect_url: basePath,
      payment_plan: id,
      customer: {
        email,
        phonenumber,
      },
      customizations: {
        title: name,
        logo: `${basePath}/images/logo.png`,
      },
      payment_options: "card, mobilemoneyfranco",
    };

    const response = await axios.post<FlutterwaveResponse>(
      "https://api.flutterwave.com/v3/payments",
      parsed,
      {
        headers: {
          Authorization: "Bearer " + process.env.FLUTTERWAVE_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}
