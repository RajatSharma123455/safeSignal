import { modalContext } from "../utils/signUpModalContext";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LogOut = ({ setIsOpen }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setLogInAndOutButton, setIsUserLoggedIn, setUserInfo } =
    useContext(modalContext);
  async function LogOutUser() {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Logout successfully");
        setLogInAndOutButton("Log In");
        setIsUserLoggedIn(false);
        setIsOpen(false);
        setUserInfo(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      console.error("Logout error:", error.response?.data?.error);
    }
  }

  return (
    <button
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
        LogOutUser();
      }}
    >
      Log Out
    </button>
  );
};

export default LogOut;
