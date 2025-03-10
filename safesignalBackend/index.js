import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import { formRouter } from "./formController/formRouter.js"
import { userRouter } from "./formController/userRouter.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({origin:"http://localhost:5173"}));

const dbPassword = process.env.DB_PASSWORD;
const dbUsername = process.env.DB_USERNAME;

async function dbConnect() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI.replaceAll(
        "${DB_USERNAME}",
        dbUsername
      ).replaceAll("${DB_PASSWORD}", dbPassword)
    );
    console.log("connected mongo db successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
dbConnect();

app.use("/",userRouter);
app.use("/",formRouter);



app.listen(3000);