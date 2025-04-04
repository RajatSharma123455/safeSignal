import express from "express";
import { configDotenv } from "dotenv";
import twilio from "twilio";
import axios from "axios";
import sendMessage from "../utils/watsapp.js";
import { requestModel } from "../db/requestModel.js";

configDotenv();
export const messageRouter = express.Router();

messageRouter.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;
  console.log("Watsapp request recoeved = ", to, message);

  try {
    const resposne = await sendMessage(to, message);
    console.log("resposne = > ", resposne);
    if (resposne) {
      res.json({ success: true, message: "WhatsApp message sent!" });
    } else {
      throw new Error("Something went wrong while sending watsapp message!");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
