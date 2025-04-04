import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const ForgotPassword = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailForForgotPassword, setEmailForForgotPassword] = useState({
    email: "",
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

  async function ForgotPasswordAPI() {
    try {
      const response = await axios.post(
        "http://localhost:3000/forgot-password",
        emailForForgotPassword,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
        setLoader(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.error);
      console.error(error);
    }
  }
  let countError = {};
  function Validation() {
    if (
      !emailForForgotPassword.email ||
      !emailRegex.test(emailForForgotPassword.email.trim())
    ) {
      countError.email = "Enter the valid email!";
    }

    setError(countError);
    setLoader(false);
    return Object.keys(countError).length === 0;
  }

  function HandleChange(e) {
    setEmailForForgotPassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  async function HandleSubmit(e) {
    e.preventDefault();
    setLoader(true);
    if (Validation()) {
      try {
        await ForgotPasswordAPI();
        setEmailForForgotPassword({
          email: "",
        });
      } catch (error) {
        console.error(" Forgort password request failed ", error.message);
      }
    }
  }

  return (
    <div className="h-[60%] w-full flex flex-col items-center rounded-lg  justify-evenly">
      <form
        onSubmit={(e) => HandleSubmit(e)}
        className=" h-full w-full flex flex-col items-center gap-12 p-2 justify-evenly"
      >
        <div className="h-[25%] w-full flex flex-col items-center">
          <input
            type="email"
            name="email"
            value={emailForForgotPassword.email}
            placeholder="Email address"
            onChange={(e) => HandleChange(e)}
             className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#37B6FF] focus:ring-2 focus:ring-[#37B6FF]/20"
          ></input>
          {error.email && <p className="text-red-400 text-sm">{error.email}</p>}
        </div>

        <button
          type="submit"
          disabled={loader}
          className="w-full pl-10 pr-3 py-2 text-xs text-white font-semibold text-center sm:text-sm border  rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#37B6FF]/20 bg-[#37B6FF] "
        >
          {loader ? (
            <div className="h-5 w-5 rounded-full border-2 flex justify-center border-white border-t-transparent animate-spin"></div>
          ) : (
            "Request password change"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
