import dotenv from "dotenv";

import {
  forgotPasswordSendEmail,
  resetPasswordService,
  verifyForgotPasswordService,
} from "../utils/authServices.js";
dotenv.config();

export const forgetPassword = async (req, res) => {
  try {
    const { isMailSend, email } = await forgotPasswordSendEmail(req.body);

    if (isMailSend) {
      res.status(200).send({
        status: true,
        message: `Reset password mail has been sent to ${email}, will get expire after 15 mins`,
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
};

export const verifyForgotPassword = async (req, res) => {
  try {
    const newToken = await verifyForgotPasswordService(req.params);
    if (newToken) {
      res.cookie("token", newToken);
      res.status(200).send({
        success: true,
        message: "Email verified successfully",
        token: newToken,
      });
    } else throw new Error("Something went wrong");
  } catch (error) {
    res.status(400).send({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong, Please try again",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log(
      "update Pass",
      req.body.updatePassword,
      "token",
      req.params.token
    );

    const isValid = await resetPasswordService(
      req.body.updatePassword,
      req.params.token
    );

    console.log("isValid", isValid);

    if (isValid) {
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      throw new Error("Could not update password. Please try again.");
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong, Try again",
    });
  }
};
