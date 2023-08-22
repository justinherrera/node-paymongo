import { z } from "zod";
import express, { NextFunction, Request, Response } from "express";

export type PaymentFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export enum PaymentMethods {
  Atome = "atome",
  Card = "card",
  Dob = "dob",
  Paymaya = "paymaya",
  Billease = "billease",
  Gcash = "gcash",
  GrabPay = "grab_pay",
}

export const CheckoutSessionId = z.string();
export const PaymentId = z.string();
