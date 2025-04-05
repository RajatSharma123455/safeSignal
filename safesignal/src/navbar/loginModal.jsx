import React, { useContext, useEffect, useState } from "react";
import { modalContext } from "../utils/signUpModalContext";
import Logo from "../assets/images-disaster/Logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import ForgotPassword from "./forgotPassword";
import { IoIosArrowBack } from "react-icons/io";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";

const LogInModal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    logInContext,
    setLogInContext,
    setUserInfo,
    setIsUserLoggedIn,
    setShowModal,
  } = useContext(modalContext);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [validationError, setValidationError] = useState({});

  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let countError = {};

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
  }, [logInContext]);

  async function LogInPosting() {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        logInForm,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("successfully submitted", response);
        setLogInForm({
          email: "",
          password: "",
        });
        toast.success("LogIn Successfully");
        setLogInContext(false);
        setUserInfo({
          name: response.data?.data?.name,
          email: response.data?.data?.email,
        });
        setIsUserLoggedIn(true);
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoader(false);
    }
  }

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

  const HandleAccount = () => {
    setLogInContext(false);
    setShowModal(true);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (Validation()) {
      LogInPosting();
    } else {
      setLoader(false);
    }
  };

  if (!logInContext) return null;

  return (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm w-full flex justify-center items-center z-50 p-1">
  <div className="bg-white rounded-2xl shadow-xl w-full sm:h-[90%] h-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3/5 xl:max-w-3/5 2xl:max-w-2xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
    
    {/* Modal Header */}
    <div className="relative p-1 sm:pl-2 md:pl-2 lg:pl-2 xl:pl-2 pb-0 ">
      <div className="flex justify-between items-start ">
        {forgotPassword && (
          <button
            onClick={() => setForgotPassword(false)}
            className="flex items-center m-2 my-4 text-xs sm:text-sm text-[#37B6FF] hover:text-[#2a8acc] transition-colors"
          >
            <IoIosArrowBack className="mr-1" /> 
            Back to login
          </button>
        )}

        <button
          className="text-gray-400 hover:text-gray-600 sm:m-1 sm:px-1 transition-colors text-lg sm:text-xl md:rounded-full md:bg-gray-200"
          onClick={() => {
            setLogInContext(false);
            setForgotPassword(false);
          }}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      {!forgotPassword && (
        <div className="flex justify-center my-1 sm:my-0 ">
          <img
            src={Logo}
            className="h-12 sm:h-14 lg:h-14 xl:h-16 w-auto"
            alt="SafeSignal Logo"
          />
        </div>
      )}
    </div>

    {/* Modal Body */}
    <div className= { forgotPassword ? "flex flex-col justify-center items-center gap-6 h-4/5" :"sm:p-2 md:p-0 h-4/5 space-y-6 p-2"}>
       
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 md:mb-0 sm:mb-3">
        {!forgotPassword ? "Welcome Back" : "Reset Your Password"}
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-center mb-4 md:mb-0 sm:mb-4 text-xs sm:text-sm">
        {!forgotPassword
          ? "Sign in to access your SafeSignal account"
          : "Enter your email to receive a password reset link"}
      </p>

      {/* Form or Forgot Password Component */}
      {!forgotPassword ? (
        <form
          onSubmit={HandleSubmit}
          className="space-y-4 w-full max-w-xs sm:max-w-sm mx-auto"
        >
          {/* Email Field */}
          <div className="space-y-1">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                name="email"
                value={logInForm.email}
                onChange={HandleChange}
                placeholder="Email address"
                className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#37B6FF] focus:ring-2 focus:ring-[#37B6FF]/20"
              />
            </div>
            {validationError.email && (
              <p className="text-red-500 text-xs mt-1">{validationError.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="password"
                name="password"
                value={logInForm.password}
                onChange={HandleChange}
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#37B6FF] focus:ring-2 focus:ring-[#37B6FF]/20"
              />
            </div>
            {validationError.password && (
              <p className="text-red-500 text-xs mt-1">{validationError.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setForgotPassword(true)}
              className="text-xs sm:text-sm text-[#37B6FF] hover:text-[#2a8acc] underline transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loader}
            className="w-full py-2 bg-[#37B6FF] hover:bg-[#2a8acc] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 flex justify-center items-center text-xs sm:text-sm"
          >
            {loader ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-xs sm:text-sm">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={HandleAccount}
              className="text-[#37B6FF] hover:text-[#2a8acc] font-medium underline transition-colors"
            >
              <FiUserPlus className="inline mr-1" /> 
              Create account
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full max-w-xs sm:max-w-sm mx-auto">
          <ForgotPassword />
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default LogInModal;
