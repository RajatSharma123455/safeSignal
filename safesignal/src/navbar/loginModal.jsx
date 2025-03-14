import React, { useContext, useEffect, useState } from "react";
import { modalContext } from "../utils/signUpModalContext";
import Logo from "../assets/images-disaster/Logo.png"
import axios from "axios";
import { toast } from "react-toastify";
import ForgotPassword from "./forgotPassword";
import { IoIosArrowBack } from "react-icons/io";


const LogInModal = () => {
  
  const { logInContext,setLogInContext } = useContext(modalContext);
  const [forgotPassword,setForgotPassword]=useState(false);
  const [loader,setLoader]=useState(false);
  console.log("login",logInContext)
  const [validationError, setValidationError] = useState({});
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  

  const [logInForm, setLogInForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (logInContext) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  },[logInContext]);

  async function LogInPosting() {
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        logInForm
      );
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
       toast.success("LogIn Successfully");
       setLoader(false)
       
      }
    } catch (error) {
      
       toast.error(error.response.data.error);
       console.log(error)
    }
  }

  let countError = {};
  function Validation() {
    if (!logInForm.email || !emailRegex.test(logInForm.email.trim())) {
      countError.email = "Enter the valid email!";
    }
    if (!logInForm.password || !passwordRegex.test(logInForm.password)) {
      countError.password = "Invalid Credentials";
    }
    setValidationError(countError);
    return Object.keys(countError).length === 0;
  }

  const HandleChange = (e) => {
    setLogInForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const HandleSubmit =async (e) => {
    
    e.preventDefault();
   setLoader(true)

    if (Validation()) {
      try{
       await LogInPosting();
       setLogInForm({
         email: "",
         password: "",
        });
      }catch(error){
        console.error("LogIn failed",error.message)
      }
    }
   
    }
  
  if (!logInContext) return null;

  return (
    <div className="fixed inset-0 bg-black h-screen w-screen bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[35%] h-[80%] flex p-4 ">
        

        <div className="w-full h-full flex  flex-col items-center  gap-8">
          <div className=" flex-col w-full h-[35%]  items-center flex gap-2">
           <div className="flex flex-row h-[65%] w-full ">

     { forgotPassword && 
      <div className="underline">
       <button onClick={()=>setForgotPassword(false)} className="flex flex-row justify-center items-center "><IoIosArrowBack className="h-4 w-4"/> Back</button>
       </div>
       }

           {!forgotPassword ? (<div className="h-30 flex w-full pl-4 justify-center">
        <img src={Logo} className="h-full w-[25%]"/>
       </div>) : <div className="w-full"></div>
       }
              <button
                className="transition-all transform flex justify-center items-center  bg-gray-200 h-[30%] right-0 w-6 rounded-full"
                onClick={() => {setLogInContext(false)
                                setForgotPassword(false)
                }}
              >
                ✕
              </button>
       </div>
       { !forgotPassword ? <h className="flex justify-center h-[80%] items-center w-[90%] text-center font-semibold text-white rounded-lg bg-[#37B6FF]">Log In to SafeSignal</h> : <h className="flex justify-center h-[40%] mb-6 items-center w-[90%] text-center font-semibold text-white rounded-lg bg-[#37B6FF]">Forgot Password</h> }
           
          </div>

        { !forgotPassword && <form
            onSubmit={(e)=>HandleSubmit(e)}
            className=" flex h-[70%] flex-col gap-8 transition-transform  w-[90%]"
          >
            

            <div className="flex flex-col h-[15%]">
              <input
                type="email"
                name="email"
                value={logInForm.email}
                onChange={(e) => HandleChange(e)}
                placeholder="Email"
                className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.email && (
                <p className="text-red-400 text-sm">{validationError.email}</p>
              )}
            </div>

            <div className="flex flex-col h-[15%]">
              <input
                type="password"
                name="password"
                value={logInForm.password}
                onChange={(e) => HandleChange(e)}
                placeholder="Password"
                className=" w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out  hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.password && (
                <p className="text-red-400 text-sm">
                  {validationError.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between h-[14%]">
              <div className="flex gap-1">
                <input type="checkbox"></input>
                <span className="text-slate-700">Remember me</span>
              </div>
              <button onClick={() =>setForgotPassword(!forgotPassword)} className="underline">Forgot Password</button>
            </div>
            <div className="flex h-[16%] ">
             
              <button type="submit" disabled={loader} className="flex items-center justify-center text-lg font-semibold  w-full h-full bg-[#37B6FF] text-white p-4 outline-none rounded-full will-change-transform duration-200 ease-out hover:scale-105  shadow-sm">
              { loader ? (<div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>) : "LogIn"}
              </button>
            </div>
          </form>}
          {
            forgotPassword && <ForgotPassword/>
          }
        </div>
      </div>
    </div>
  );
};

export default LogInModal;
