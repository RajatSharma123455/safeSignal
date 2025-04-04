import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import validator from "validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { victim, volunteer } from "../db/signupSchema.js";
import { resetPasswordToken } from "../db/resetTokenSchema.js";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const mailTranspoter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL or 587 for TLS
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

const getJWTAccessToken = (payload) => {
  console.log("enter getJwt");
  return jwt.sign({ payload }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const forgotPasswordSendEmail = async (data) => {
  const { email } = data;
  console.log("email", email);
  if (!email) throw new Error("Email is required");

  if (!validator.isEmail(email)) throw new Error("Email is invalid");

  let user =
    (await victim.findOne({ email })) || (await volunteer.findOne({ email }));

  console.log("user", user);
  if (!user)
    throw new Error("Email is not registered with us, please sign up first");

  const olderResetToken = await resetPasswordToken.deleteMany({
    userId: user._id,
  });
  console.log("olderResetToken", olderResetToken);

  const resetToken = getJWTAccessToken(user._id);
  console.log("resettoken", resetToken, "user._id", user._id);

  const hashToken = await bcrypt.hash(resetToken, 10);
  console.log("hashToken", hashToken);

  await resetPasswordToken.create({
    userId: user._id,
    token: hashToken,
    expiresAt: new Date(Date.now() + 900000),
  });

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
  try {
    const { token } = data;
    const verified = jwt.verify(token, ACCESS_SECRET);
    return jwt.sign({ payload: verified.payload }, ACCESS_SECRET, {
      expiresIn: "15m",
    });
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const resetPasswordService = async (newpassword, token) => {
  try {
    console.log("enter reset Password------------->");

    if (!token) throw new Error("Unauthorized access");

    const isVerified = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("isVerified", isVerified);

    const userId = isVerified.payload;
    const resetTokenEntry = await resetPasswordToken.find({ userId });
    console.log("resetTokenEntry", resetTokenEntry);

    if (!(resetTokenEntry.length > 0)) {
      throw new Error("Invalid or expired token");
    }

    const isTokenValid = await bcrypt.compare(token, resetTokenEntry[0].token);
    console.log("isTokenValid", isTokenValid);
    if (!isTokenValid) {
      throw new Error("Invalid token");
    }

    let user =
      (await victim.findById(userId)) || (await volunteer.findById(userId));
    console.log("user", user);
    if (!user) throw new Error("User not found");

    user.password = await bcrypt.hash(newpassword, 10);
    console.log("New Password", user.password);

    await user.save();
    console.log("User updates pass with details", user.password);

    await resetPasswordToken.deleteOne({ userId });

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
