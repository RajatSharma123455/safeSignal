import { victim } from "../db/schema.js";

export const EmergencyMiddleware=((req,res,next)=>{
try{
    let {
        name,
        email,
        latitude,
        longitude,
        disasterType,
        dateAndTime,
        immediateNeeds,
        numberOfPeople,
        medicalConditions,
      } = req.body;
     
       


}catch(error){
    res.status(404).json({error:error.message});
}

});