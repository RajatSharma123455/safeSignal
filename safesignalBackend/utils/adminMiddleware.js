
import { configDotenv } from "dotenv"
import jwt from "jsonwebtoken"
import { victim, volunteer } from "../db/signupSchema.js";

configDotenv();
export default async function AdminMiddleware(req,res,next){
      try{
        console.log("enter adminmiddle")
        const secretKey=process.env.secret;
        const cookies=req.cookies;
        const {token}=cookies
        console.log("token and secret",secretKey,token)
        if(!token){
            throw new Error("invalid token");
        }
        
    const decodedMessage=await jwt.verify(token,secretKey)
       const {_id}=decodedMessage;
       const isVictimUser=await victim.findById({_id});
       const isVolunteerUser=await volunteer.findById({_id});

       let user;

       if(isVolunteerUser){
        user=isVolunteerUser;
       }else if(isVictimUser){
        user=isVictimUser;
       }else{
        throw new Error("user not found");
       }

       req.user=user;
       next();

      }catch(error){
    res.status(404).json({error:error.message})
}
}