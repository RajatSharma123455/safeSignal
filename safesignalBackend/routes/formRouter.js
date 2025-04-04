import express from "express";
import { victimForm, volunteerForm } from "../db/UserModel.js";
import { volunteer, victim } from "../db/signupSchema.js";
import { Router } from "express";
import AdminMiddleware from "../utils/adminMiddleware.js";
import { requestModel } from "../db/requestModel.js";

export const formRouter = express.Router();

formRouter.post("/victim/form", AdminMiddleware, async (req, res) => {
  try {
    const user = req.user;

    let {
      name,
      location,
      disasterType,
      dateAndTime,
      immediateNeeds,
      numberOfPeople,
      medicalConditions,
    } = req.body;

    let isAlreadyExistVolunteer = await volunteer.findOne({
      email: user?.email,
    });

    if (isAlreadyExistVolunteer) {
      return res.status(400).json({
        success: false,
        msg: "Oops! This form is meant for victims only.",
      });
    }
    let isAlreadyExistVictim = await victim.findOne({ email: user?.email });
    if (!isAlreadyExistVictim) {
      return res.status(400).json({
        success: false,
        msg: "You are not Logged In!",
      });
    }

    console.log("request-body", req.body);
    await victimForm.create({
      userID: user._id,
      name,
      location,
      disasterType,
      dateAndTime,
      immediateNeeds,
      numberOfPeople,
      medicalConditions,
      email: user.email,
      phone: user.mobile,
    });
    res.status(200).json({ success: true, msg: "successfuly created" });
    // }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});
formRouter.post("/volunteer/form", AdminMiddleware, async (req, res) => {
  try {
    const user = req.user;
    console.log("Volunteer = ", req.user);

    const { name, location, teamsize, dateAndTime, expertise } = req.body;

    let isAlreadyExistVictim = await victim.findOne({ email: user?.email });

    if (isAlreadyExistVictim) {
      throw new Error("Hey there! This form is for volunteers.");
    }

    let isAlreadyExistVolunteer = await volunteer.findOne({
      email: user?.email,
    });
    if (!isAlreadyExistVolunteer) {
      return res.status(400).json({
        success: false,
        msg: "You are not Logged In!",
      });
    }

    let alreadyFilledVolunteerForm = await volunteerForm.findOne({
      email: user.email,
    });
    if (alreadyFilledVolunteerForm) {
      res.status(403).json({ msg: "Volunteer has already filled the form!" });
    } else {
      await volunteerForm.create({
        userID: user._id,
        name,
        location,
        teamsize,
        dateAndTime,
        expertise: expertise.toLowerCase(),
        email: user.email,
        phone: user.phone,
      });
      res.status(200).json({ success: true, msg: "successfully sumbitted" });
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

formRouter.post("/victim/location", async (req, res) => {
  try {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    // const reports = await victimForm.find({
    //   location: {
    //     $near: {
    //       $geometry: {
    //         type: "Point",
    //         coordinates: [longitude, latitude],
    //       },
    //       $maxDistance: 50000000, // Distance in meters (5 km)
    //     },
    //   },
    // });
    const reports = await requestModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 50000000, // Distance in meters (5 km)
        },
      },
    });
    res.json({ msg: "location identified", data: reports });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
