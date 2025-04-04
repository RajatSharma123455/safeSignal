import express from "express";
import { SignupValidation } from "../utils/signupValidation.js";
import { victim, volunteer } from "../db/signupSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { victimForm, volunteerForm } from "../db/UserModel.js";
import { requestModel } from "../db/requestModel.js";
import sendMessage from "../utils/watsapp.js";
import {
  forgetPassword,
  verifyForgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import nodemailer from "nodemailer";
import AdminMiddleware from "../utils/adminMiddleware.js";
import mongoose from "mongoose";
import { error } from "qrcode-terminal";
import { Admin } from "mongodb";
import { NotificationModel } from "../db/notificationModel.js";

configDotenv();
export const userRouter = express.Router();
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

userRouter.get("/", AdminMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.status(200).json({
        msg: "user is already logged in",
        success: true,
        data: { name: user?.name, email: user?.email, role: user?.role },
      });
    }
  } catch (error) {
    res.status(400).json({ msg: "pls logged in first", success: false });
  }
});

userRouter.post("/signup/victim", async (req, res) => {
  try {
    SignupValidation(req);

    const { name, email, password, mobile } = req.body;

    const isExistVictim = await victim.findOne({ email });
    const isExistVolunteer = await volunteer.findOne({ email });
    if (isExistVictim) {
      throw new Error("User already register");
    } else if (isExistVolunteer) {
      throw new Error("User already register");
    }
    const isExistVictimMobile = await victim.findOne({ mobile });
    const isExistVolunteerMobile = await volunteer.findOne({ mobile });
    if (isExistVictimMobile) {
      throw new Error("Mobile number already register");
    } else if (isExistVolunteerMobile) {
      throw new Error("Mobile number already register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await victim.create({
      name,
      email,
      password: hashedPassword,
      phone: mobile,
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

    const isExistVictim = await victim.findOne({ email });
    const isExistVolunteer = await volunteer.findOne({ email });
    if (isExistVictim) {
      throw new Error("User already register");
    } else if (isExistVolunteer) {
      throw new Error("User already register");
    }
    const isExistVictimMobile = await victim.findOne({ mobile });
    const isExistVolunteerMobile = await volunteer.findOne({ mobile });
    if (isExistVictimMobile) {
      throw new Error("Mobile number already register");
    } else if (isExistVolunteerMobile) {
      throw new Error("Mobile number already register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await volunteer.create({
      name,
      email,
      password: hashedPassword,
      phone: mobile,
    });
    res.status(200).json({ msg: "created successfully", data: data });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});
userRouter.post("/login", async (req, res) => {
  try {
    const secretKey = process.env.ACCESS_SECRET;
    const { email, password } = req.body;
    const isVictimExist = await victim.findOne({ email });
    const isVolunteerExist = await volunteer.findOne({ email });

    let userPassword, userId, name;

    if (isVictimExist) {
      userPassword = isVictimExist.password;
      userId = isVictimExist._id;
      name = isVictimExist.name;
    } else if (isVolunteerExist) {
      userPassword = isVolunteerExist.password;
      userId = isVolunteerExist._id;
      name = isVolunteerExist.name;
    } else {
      throw new Error("user not exist");
    }

    const isPassword = bcrypt.compare(password, userPassword);

    if (!isPassword) {
      throw new Error("invalid password");
    }
    const token = jwt.sign({ _id: userId._id }, secretKey, {
      expiresIn: "8h",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      data: { email: email, name: name },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

userRouter.post("/logout", AdminMiddleware, (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).json({ msg: "logout successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
userRouter.post("/forgot-password", forgetPassword);
userRouter.get("/reset-password/:token", verifyForgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.post("/search-volunteers", async (req, res) => {
  try {
    const { lat, long } = req.body;
    // console.log("User loc = ", lat, long);
    var volunteers = [];
    if (lat && long) {
      volunteers = await volunteerForm.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lat, long],
            },
            $maxDistance: 5000000000000,
          },
        },
      });
    }
    res.status(200).send({
      success: true,
      message: "Volunteer fetched successfully",
      data: volunteers,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/search-volunteers", async (req, res) => {
  const queryParam = req.query;
  console.log("QueryParam", queryParam);

  try {
    const { lat, lng, distanceRange, services } = req.query;
    let serviesArray = [];
    if (Array.isArray(services)) {
      serviesArray = services.map((s) => s.trim().toLowerCase());
    } else if (services) {
      serviesArray = [services.trim().toLowerCase()];
    }

    // console.log("User loc = ", lat, lng, distanceRange, serviesArray);
    if (lat && lng) {
      const volunteers = await volunteerForm.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: +distanceRange * 1000,
          },
        },
        expertise: { $in: serviesArray },
      });

      res.status(200).send({
        success: true,
        message: "Volunteer fetched successfully",
        data: volunteers,
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

userRouter.post("/search-victims", async (req, res) => {
  try {
    const { lat, long } = req.body;
    console.log("User loc = ", lat, long);
    var victims = [];
    if (lat && long) {
      victims = await requestModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lat, long],
            },
            $maxDistance: 500000,
          },
        },
      });
    }
    // console.log("All victims found = ", victims);
    res.status(200).send({
      success: true,
      message: "Victims fetched successfully",
      data: victims,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/search-victims", async (req, res) => {
  const queryParam = req.query;
  console.log("QueryParam", queryParam);
  try {
    const { lat, lng, distanceRange, needs, disasters } = req.query;
    let needsArray = [];
    if (Array.isArray(needs)) {
      needsArray = needs.map((s) => s.trim().toLowerCase());
    } else if (needs) {
      needsArray = [needs.trim().toLowerCase()];
    }

    let disasterArray = [];
    if (Array.isArray(disasters)) {
      disasterArray = disasters.map((s) => s.trim().toLowerCase());
    } else if (disasters) {
      disasterArray = [disasters.trim().toLowerCase()];
    }

    if (lat && lng) {
      let query = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lat, lng],
            },
            $maxDistance: +distanceRange * 1000, // Convert km to meters
          },
        },
        status: { $eq: "pending" },
      };

      // Add "immediateNeeds" filter only if needsArray is not empty
      if (needsArray.length > 0) {
        query["requestDetails.immediateNeeds"] = { $in: needsArray };
      }

      // Add "disasterType" filter only if disasterArray is not empty
      if (disasterArray.length > 0) {
        query["requestDetails.disasterType"] = { $in: disasterArray };
      }

      const victims = await requestModel.find(query);

      console.log(
        "Found victim : => ",
        victims,
        lat,
        lng,
        distanceRange,
        needsArray,
        disasterArray
      );

      res.status(200).send({
        success: true,
        message: "Victims fetched successfully",
        data: victims,
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

userRouter.post("/emergency-request", AdminMiddleware, async (req, res) => {
  try {
    const { to, email, message, volunteerID, location } = req.body;
    console.log(" request recieved = ", req.body);
    const mailBody = `
              <h1>Victim Request raised to you!</h1>
              <p>Victim Name: ${message.name}</p>
              <p>Location: ${message.locationName}</p>
              <p>Needs: ${message.immediateNeeds}</p>
              <p>Number of People: ${message.numberOfPeople}</p>
              `;

    const emailSend = await mailTranspoter.sendMail({
      from: EMAIL_USERNAME,
      to: email,
      subject: `Emergency request raised by ${message.name}`,
      html: mailBody,
    });

    const watsapp = await sendMessage(to, message);

    let requestType = [];
    if (watsapp) {
      requestType.push("watsapp");
    }
    if (emailSend) {
      requestType.push("email");
    }

    const notify = await NotificationModel.create({
      userID: new mongoose.Types.ObjectId(volunteerID),
      message: `Victim ${req.user.name} has raised a help request to you `,
    });

    if (watsapp || emailSend || notify) {
      const emailReq = await requestModel.create({
        requestDetails: {
          name: message.name,
          location: message.locationName,
          immediateNeeds: message.immediateNeeds,
          numberOfPeople: message.numberOfPeople,
          disasterType: message.disasterType,
          medicalConditions: message.medicalConditions,
        },
        requestType: requestType,
        location: location,
        victimInfo: {
          userID: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
        },
        volunteerInfo: [new mongoose.Types.ObjectId(volunteerID)],
        status: "pending",
      });

      if (!emailReq) throw error("Something went wrong, try again!");

      // add request to respective volunteer
      await volunteerForm.findOneAndUpdate(
        { userID: volunteerID },
        {
          $push: { requests: emailReq },
        }
      );

      // add request to respective victim
      await victim.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { requests: emailReq },
        }
      );

      res.status(200).send({
        status: 200,
        message: "Emergency request raised successfully",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
});

userRouter.get("/user-profile", AdminMiddleware, async (req, res) => {
  try {
    let requests = [];
    if (req.user.role === 1) {
      requests = await requestModel.find({
        "victimInfo.userID": req.user._id,
      });
    } else {
      requests = await requestModel.find({
        $or: [
          { "rejectedBy.email": req.user.email },
          { "acceptedBy.email": req.user.email },
          {
            $and: [{ volunteerInfo: req.user._id }, { status: "pending" }],
          },
        ],
      });
    }

    res.status(200).send({
      success: true,
      message: "Fetched profile successfully",
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
        },
        requests: requests,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || "Something went wrong while fetching profile",
    });
  }
});

userRouter.patch("/update-user-profile", AdminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    console.log("profile user = ", req.body);
    let updatedUser;
    if (req.user.role === 1) {
      updatedUser = await victim.findOneAndUpdate(
        { email: req.user?.email },
        {
          $set: req.body,
        },
        { new: true }
      );
    } else {
      updatedUser = await volunteer.findOneAndUpdate(
        { email: req.user?.email },
        {
          $set: req.body,
        },
        { new: true }
      );
    }

    res.status(201).send({
      success: true,
      message: "successfully updated profile",
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message || "Something went wrong while updating profile",
    });
  }
});

userRouter.get(
  "/accept-help-request/:id",
  AdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Accept = ", id);

      const request = await requestModel.findOneAndUpdate(
        { _id: id, status: "pending" },
        {
          $set: {
            acceptedBy: [
              { userId: req.user._id, email: req.user.email, time: Date.now },
            ],
            status: "in progress",
          },
        },
        { new: true }
      );
      console.log("Accept req = ", request, id);
      const notify = await NotificationModel.create({
        userID: request?.victimInfo?.userID,
        message: `${request.requestID} request has been Accepted by ${req.user.name}`,
      });

      if (request && request.status == "in progress" && notify) {
        res.status(200).send({
          success: true,
          message: "request accepted",
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Someting went wrong, try again" + error.message,
      });
    }
  }
);

userRouter.get(
  "/reject-help-request/:id",
  AdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const request = await requestModel.findOneAndUpdate(
        { _id: id, status: "pending" },
        {
          $set: {
            rejectedBy: [
              { userId: req.user._id, email: req.user.email, time: Date.now },
            ],
            status: "rejected",
          },
        },
        { new: true }
      );

      const notify = await NotificationModel.create({
        userID: request.victimInfo.userID,
        message: `${request.requestID} request has been Rejected by ${req.user.name}`,
      });

      console.log(
        " Rejected = ",
        request,
        request.status == "rejected",
        notify
      );
      if (request && request.status == "rejected" && notify) {
        res.status(200).send({
          success: true,
          message: "request rejected",
        });
      } else {
        throw new Error("Request of rejecting has been declined");
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
);

userRouter.get(
  "/cancel-help-request/:id",
  AdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const request = await requestModel.findOneAndUpdate(
        { _id: id, status: "pending" },
        {
          $set: {
            status: "canceled",
          },
        },
        { new: true }
      );

      const notify = await NotificationModel.create({
        userID: request.volunteerInfo,
        message: `${request.requestID} request has been canceled`,
      });

      if (request && request.status == "canceled" && notify) {
        res.status(200).send({
          success: true,
          message: "request canceled",
        });
      } else {
        throw new Error("Request of cancellation has been declined");
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Someting went wrong, try again",
      });
    }
  }
);

userRouter.patch(
  "/complete-help-request/:id",
  AdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const request = await requestModel.findOneAndUpdate(
        { _id: id, status: "in progress" },
        {
          $set: {
            status: "completed",
          },
        },
        { new: true }
      );

      const notify = await NotificationModel.create({
        userID: request.victimInfo.userID,
        message: ` ${req.user.name} marked ${request.requestID} request as Completed`,
      });

      if (request && request.status == "completed" && notify) {
        res.status(200).send({
          success: true,
          message: "request completed",
        });
      } else {
        throw new Error(
          "Something went wrong, can't mark this request as Complete"
        );
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Someting went wrong, try again",
      });
    }
  }
);

userRouter.get("/get-notifications", AdminMiddleware, async (req, res) => {
  try {
    const notifications = await NotificationModel.find({
      userID: req.user._id,
    });
    console.log("Notifcation -> ", req.user._id);
    if (notifications) {
      res.status(200).send({
        success: true,
        message: "All Notifications fetched successfully",
        data: notifications,
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get(
  "/mark-notification-read/:id",
  AdminMiddleware,
  async (req, res) => {
    try {
      let notifications = [];
      const { id } = req.params;
      if (id == "all") {
        notifications = await NotificationModel.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isRead: true,
            },
          }
        );
      } else {
        notifications = await NotificationModel.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isRead: true,
            },
          }
        );
      }
      if (notifications) {
        res.status(200).send({
          success: true,
          message: "Notifications marked as Read",
          data: notifications,
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
);

userRouter.patch(
  "/mark-all-notification-read",
  AdminMiddleware,
  async (req, res) => {
    try {
      await NotificationModel.updateMany(
        { userID: req.user._id, isRead: false }, // Only update unread notifications
        { $set: { isRead: true } }
      );

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error marking all notifications as read",
        error: error.message,
      });
    }
  }
);

userRouter.get(
  "/delete-notification/:id",
  AdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const notifications = await NotificationModel.findOneAndDelete({
        _id: id,
      });
      if (notifications) {
        res.status(200).send({
          success: true,
          message: "Notification deleted",
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
);
