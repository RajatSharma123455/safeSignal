import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import validator from "validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { victimForm } from "../db/schema.js";
import { victim, volunteer } from "../db/signupSchema.js";


dotenv.config();

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const ACCESS_SECRET = process.env.secret;

const mailTranspoter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use 465 for SSL or 587 for TLS
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });
  
  const getJWTAccessToken = (payload)=> {
    const token = jwt.sign({ payload }, ACCESS_SECRET,{
      expiresIn: "15m",
    });
    return token;
  };
  export const forgotPasswordSendEmail = async (data) => {
    const { email } = data;
    if (!email) throw new Error("Email is required");
  
    if (!validator.isEmail(email)) throw new Error("Email is invalid");
  
    let user = await victim.findOne({ email });
    if (!user) {
      user = await volunteer.findOne({ email });
    }
    if (!user)
      throw new Error("Email is not registered with us, please sign up first");
  
    const resetToken = getJWTAccessToken(user._id);
    console.log("reset token",resetToken)
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: "Password Reset Request",
      html: `
              <h2>Password Reset Request</h2>
              <p>Click the link below to reset your password:</p>
              <a href="http://localhost:5173/reset-password/${resetToken}">Reset Password</a>
              <p>If you did not request this, please ignore this email.</p>
          `,
    };
    return { isMailSend: await mailTranspoter.sendMail(mailOptions), email };
  };
  
  export const verifyForgotPasswordService = async (data) => {
    const { token } = data;
    const verified = jwt.verify(token, ACCESS_SECRET);
    console.log("forgot pass = ", verified, token);
    if (verified) {
      const newToken = jwt.sign(
        { payload: (verified).payload },
        ACCESS_SECRET,
        {
          expiresIn: "15m",
        }
      );
      return newToken;
    } else {
      throw new Error("Something went wrong, Try again");
    }
  };
  
  export const resetPasswordService = async (
    password 
    , token 
  ) => {
    try{
    console.log("Pass = , ", password)
    console.log("token = , ", token)
    if (!token) throw new Error("Unauthorized access");
    const isVerified = jwt.verify(token, ACCESS_SECRET);
    console.log("verified",isVerified);

    let userId=isVerified.payload;
    let user;
    if (isVerified) {
        const hashedPassword = await bcrypt.hash(password, 10);
      user = await victim.findOne({_id:userId})
      if(user){
          await victim.updateOne(
              { _id: (isVerified).payload },
              { password: hashedPassword }
          );
      }else{
        user = await volunteer.findOne({_id:userId})
        if(user){
            await volunteer.updateOne(
                { _id: (isVerified).payload },
                { password: hashedPassword }
            );
        }
          }
    if(!user) throw new Error("User not found")
    }
    }catch(error){
      throw new Error(error.message)
    }
  };