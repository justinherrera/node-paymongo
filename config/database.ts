import { connect as connection } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURL = process.env.LOCAL_DBURL as string;

const connect = async () => {
  console.log("Connecting to database...");
  await connection(dbURL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export { connect };
