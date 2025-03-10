import validator from "validator"

 export const SignupValidation = (req) => {
   const {name,email,password,mobile}=req.body;

   if(!name){
throw new Error("enter the your name");
   }else if(name.length<4 || name.length>50){
    throw new Error("your name characters should be between '4-50'")
   }else if(!validator.isEmail(email)){
    throw new Error("enter the valid email")
   }else if(!validator.isStrongPassword(password)){
    throw new Error("your password is weak")
   }else if(!validator.isMobilePhone(mobile, 'en-IN' ,{ strictmode:true })){
    throw new Error("Invalid Mobile number")
   }
};