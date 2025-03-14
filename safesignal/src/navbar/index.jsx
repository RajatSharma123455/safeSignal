import { IoMdMenu } from "react-icons/io";
import { useContext, useState } from "react";
import Logo from "../assets/images-disaster/Logo.png";
import { Link, useLocation } from "react-router-dom";
import { modalContext } from "../utils/signUpModalContext.jsx";


export default function Navbar() {
  const {  setShowModal } = useContext(modalContext);
  const { setLogInContext } = useContext(modalContext);
  const [onClickMenu, setOnClickMenu] = useState(false);
  const location=useLocation();

  const isResetPasswordPage = ["/reset-password/","/victim/form","/volunteer/form"].some((path)=>location.pathname.startsWith(path));
  const navbarStyle= isResetPasswordPage ? "bg-black" : "bg-transparent"

  function HandleClick() {
    setOnClickMenu(!onClickMenu);
  }

  return (
    <div className={`${navbarStyle} md:pl-4 pl-4 lg:pl-6  flex justify-between items-center sm:items-center pr-4 absolute  z-50 h-[5rem] w-[100%] lg:max-w-screen `}>
      <img src={Logo} className="h-full flex-[0.07]" />
      {/* Mobile Navbar */}
      <div className="relative md:hidden">
        <button onClick={HandleClick} className="relative">
          <IoMdMenu className="min-h-10 min-w-10 shadow-white fill-white" />
        </button>
        {onClickMenu && (
          <div className="text-sm absolute right-40 top-12 font-bold border border-white">
            <div
              className="absolute text-white bg-[#62c4fd]  transition-transform shadow-md h-[12rem] w-[9rem] flex-col rounded-sm"
              onFocus={() => setOnClickMenu(true)}
              onBlur={() => setOnClickMenu(false)}
            >
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                <Link to="/">Home</Link>
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                <Link to="/signup/victim">About us</Link>
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                <Link to="/contact-us">Contact Us</Link>
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                Register
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                LogIn
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <div className="justify-around flex-[0.75] md:flex md:flex-[0.6] lg:flex lg:flex-[0.5]  md:font-semibold md:items-center lg:items-center hidden sm:hidden ">
        <Link
          to="/"
          className="hover:text-blue-400 text-white font-[400] transition-transform  text-center"
        >
          Home
        </Link>
        <Link
          to="/about-us"
          className="hover:text-blue-400 text-white font-[400] transition-transform  text-center"
        >
          About us
        </Link>
        <Link
          to="/contact-us"
          className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
        >
          Contact Us
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="hover:text-blue-400 text-white font-[400] transition-transform  text-center"
        >
          Register
        </button>
        <button 
          onClick={() => setLogInContext(true)}
          
        className="hover:text-blue-400 text-white font-[400] transition-transform  text-center">
          LogIn
        </button>
      </div>
    </div>
  );
}
