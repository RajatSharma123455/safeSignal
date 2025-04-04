import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { formRouter } from "./routes/formRouter.js";
import { userRouter } from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import { messageRouter } from "./messaging/SendMessage.js";
import { victimForm, volunteerForm } from "./db/UserModel.js";
import { requestModel } from "./db/requestModel.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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
    // Optionally force index creation
    await volunteerForm.createIndexes();
    await victimForm.createIndexes();
    await requestModel.createIndexes();
    console.log("connected mongo db successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
dbConnect();

app.use("/", userRouter);
app.use("/", formRouter);
app.use("/", messageRouter);

app.listen(3000);
