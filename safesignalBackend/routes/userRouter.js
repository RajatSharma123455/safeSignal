import express from "express";
import { SignupValidation } from "../utils/signupValidation.js";
import { victim, volunteer } from "../db/signupSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { forgetPassword,verifyForgotPassword,resetPassword } from "../Controllers/authController.js";

configDotenv();
export const userRouter = express.Router();

userRouter.post("/signup/victim", async (req, res) => {
  try {
    SignupValidation(req);

    const { name, email, password, mobile } = req.body;

    const exist = await victim.findOne({ email });
    if (exist) {
      throw new Error("this email is already exist");
    }
    const isMobileExist = await volunteer.findOne({mobile});
    if (isMobileExist) {
      throw new Error("This mobile is already register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await victim.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });
    res.status(200).json({ msg: "created successfully", data: data });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});
userRouter.post("/signup/volunteer", async (req, res) => {
  try {
    SignupValidation(req);

    const { name, email, password, mobile } = req.body;

    const exist = await volunteer.findOne({ email });
    if (exist) {
      throw new Error("this email is already exist");
    }
    const isMobileExist = await volunteer.findOne({mobile});
    if (isMobileExist) {
      throw new Error("This mobile is already register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await volunteer.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });
    res.status(200).json({ msg: "created successfully", data: data });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});
userRouter.post("/login", async (req, res) => {
  try {
    const secretKey = process.env.secret;
    const { email, password } = req.body;
    const isVictimExist = await victim.findOne({ email });
    const isVolunteerExist=await volunteer.findOne({ email });

    let userPassword;
    let userId;

    if (isVictimExist ) {
         userPassword = isVictimExist.password;
         userId = isVictimExist._id
    }else if(isVolunteerExist){
         userPassword = isVolunteerExist.password;
        userId = isVolunteerExist._id;
    }else{
      throw new Error("User not exist");
    }
   
    const isPassword = await bcrypt.compare(password, userPassword);

    if (!isPassword) {
      throw new Error("Invalid password");
    } else {
        
      const token = jwt.sign({ _id: userId._id }, secretKey, {
        expiresIn: "8h",
      });
      
      res.cookie("token", token, {expires:new Date(Date.now() + 8 * 3600000)});
      res.status(200).json({ msg: "login Successfuly" });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

userRouter.post("/forgot-password", forgetPassword);
userRouter.get("/reset-password/:token", verifyForgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.status(200).json({msg:"logout successfully"})
})


