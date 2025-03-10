import React, { useContext, useEffect, useState } from "react";
import { modalContext } from "./utils/modalContext";
import volunteer from "../assets/images-disaster/volunteerHelp2.webp";
import axios from "axios";

const SignUpVolunteer = () => {
  const { showModal, setShowModal } = useContext(modalContext);
  const [validationError, setValidationError] = useState({});
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mobileRegex = /^[0-9]{10}$/;

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });

  async function SignupDataPosting() {
    try {
      const response = await axios.post(
        "http://localhost:3000/signup/volunteer",
        signupForm
      );
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("error:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server");
      } else {
        console.error(error.message);
      }
    }
  }

  let countError = {};
  function Validation() {
    if (
      !signupForm.name ||
      typeof signupForm.name !== "string" ||
      signupForm.name.trim().length === 0
    ) {
      countError.name = "Enter the valid Name!";
    }
    if (!signupForm.email || !emailRegex.test(signupForm.email.trim())) {
      countError.email = "Enter the valid email!";
    }
    if (!signupForm.password || !passwordRegex.test(signupForm.password)) {
      countError.password =
        "Invalid Credentials";
    }
    if (!signupForm.mobile || !mobileRegex.test(signupForm.mobile.trim())) {
      countError.mobile = "Enter a valid 10-digit mobile number!";
    }
    setValidationError(countError);
    return Object.keys(countError).length === 0;
  }

  const HandleChange = (e) => {
    setSignupForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const HandleSubmit = (e) => {
    e.preventDefault();

    if (Validation()) {
      SignupDataPosting();
      alert("signup successfully");
      setSignupForm({
        name: "",
        email: "",
        password: "",
        mobile: "",
      });
    }
  };
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black h-screen w-screen bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-2/3 h-[90%] flex">
        <div className="flex-1 ">
          <img
            src={volunteer}
            alt="volunteer"
            className="h-full rounded-tl-xl rounded-bl-xl"
          />
        </div>

        <div className="flex-1 flex flex-col items-center p-4 pt-6 gap-8">
          <div className="flex flex-row w-full items-center justify-around  h-[3rem]">
            <div className="h-full flex flex-0.6 items-center ">
              <h2 className="text-lg text-white pt-1 font-semibold bg-sky-400 h-4/5 w-80 transform shadow-sm text-center rounded-lg">
                Join as a Volunteer
              </h2>
            </div>
            <button
              className="transition-all transform border-black flex-0.2 bg-gray-200 h-8 w-8 rounded-full"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
          <form
            onSubmit={HandleSubmit}
            className=" flex flex-col gap-8 transition-transform h-4/5 w-[90%]"
          >
            <div className="flex flex-col h-[12%]">
              <input
                type="text"
                name="name"
                value={signupForm.name}
                onChange={(e) => HandleChange(e)}
                placeholder="Full Name"
                className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.name && (
                <p className="text-red-400 text-sm">{validationError.name}</p>
              )}
            </div>

            <div className="flex flex-col h-[12%]">
              <input
                type="email"
                name="email"
                value={signupForm.email}
                onChange={(e) => HandleChange(e)}
                placeholder="Email"
                className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.email && (
                <p className="text-red-400 text-sm">{validationError.email}</p>
              )}
            </div>

            <div className="flex flex-col h-[12%]">
              <input
                type="password"
                name="password"
                value={signupForm.password}
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
              <div className="flex flex-col h-[90%] ">
                <input
                  type="text"
                  name="mobile"
                  value={signupForm.mobile}
                  onChange={(e) => HandleChange(e)}
                  placeholder="Mobile Number"
                  className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2 focus:border-sky-300 shadow-sm"
                ></input>
                {validationError.mobile && (
                  <p className="text-red-400 text-sm">
                    {validationError.mobile}
                  </p>
                )}
              </div>

              <div className="flex gap-1">
                <input type="checkbox"></input>
                <span className="text-slate-700">Remember me</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 h-[10%]">
              {" "}
              <button className="flex items-center justify-center text-lg font-semibold  w-full h-full bg-sky-400 text-white p-4 outline-none rounded-full will-change-transform duration-200 ease-out hover:scale-105  shadow-sm">
                Sign Up
              </button>
              <div className="flex flex-row-reverse">
                <a href="/">forgot Password</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpVolunteer;
