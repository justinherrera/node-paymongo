import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "./config/database";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";

import { AppError, globalErrorHandler } from "./middlewares/ErrorHandler";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

connect();

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  next();
});

app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/", authRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log("Port listening...", port);
});
