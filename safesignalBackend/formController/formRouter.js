import express from "express";
import { victimForm,volunteerForm  } from "../db/schema.js";

import { Router } from "express";
import AdminMiddleware from "../utils/adminMiddleware.js";

export const formRouter=express.Router();

formRouter.post("/emergency/form",AdminMiddleware,async (req, res) => {
  try {
    const user=req.user;

    let {
      name,
      location,
      disasterType,
      dateAndTime,
      immediateNeeds,
      numberOfPeople,
      medicalConditions,
    } = req.body;

    let alreadyExist = await victimForm.findOne({ email: user?.email });

    if (alreadyExist) {
      res.status(403).json({ msg: "user already exist" });

    } else {
      console.log("reuest-body",req.body);
      await victimForm.create({
        name,
        location,
        disasterType,
        dateAndTime,
        immediateNeeds,
        numberOfPeople,
        medicalConditions,
      });
      res.status(200).json({ msg: "successfuly created" });
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});
formRouter.post("/volunteer/form",AdminMiddleware,async (req,res)=>{
    try{
      const user=req.user;

   const   { name,
    location,
    teamsize,
    dateAndTime,
    expertise
   }=req.body;

   let alreadyExist= await volunteerForm.findOne({email:user.email})
   if(alreadyExist){
    res.status(403).json({msg:"user already exist"})
   }
   else{
    await volunteerForm.create({ name,
        location,
        teamsize,
        dateAndTime,
        expertise
       })
       res.status(200).json({msg:"successfully sumbitted"})
    }

    }
    catch(error){
        res.status(404).json({msg:error.message})
    }
});

formRouter.post("/victim/location",async (req,res)=>{
 try{ const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  
  const reports = await victimForm.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 50000000, // Distance in meters (5 km)
      },
    },

  });
  res.json({msg:"location identified",data:reports})
  

}catch(error){
  res.status(404).json({error:error.message})
}
})