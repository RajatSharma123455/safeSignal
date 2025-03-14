
import dotenv from "dotenv";
import { forgotPasswordSendEmail,verifyForgotPasswordService,resetPasswordService} from "../utils/authservice.js";
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
      console.log("pass,param",req.body.updatePassword,req.params.token)
      await resetPasswordService(req.body.updatePassword, req.params.token);
      res.status(201).send({
        success: true,
        message: "Password update successful",
      });
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