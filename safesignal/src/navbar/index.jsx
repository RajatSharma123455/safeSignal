import { IoMdMenu } from "react-icons/io";
import { useContext, useState } from "react";
import Logo from "../assets/images-disaster/Logo.png"
import { Link } from "react-router-dom";
import { modalContext } from "./utils/modalContext.jsx";
// import SignUpModal from "./utils/modalContext";

export default function Navbar() {
  const {showModal,setShowModal}=useContext(modalContext);
  const [onClickMenu, setOnClickMenu] = useState(false);

  function HandleClick() {
    setOnClickMenu(!onClickMenu);
   
  }

  return (
    <div className=" md:pl-4 pl-4 lg:pl-6  flex justify-between items-center sm:items-center pr-4 absolute  z-50 h-[4rem] w-[100%] lg:max-w-screen bg-white/30 backdrop-blur-md shadow-md  ">
      <img src={Logo}  className="h-full w-[8%] "/>
      <div className="relative md:hidden">
      <button onClick={HandleClick} className="relative" >
      <IoMdMenu className="min-h-10 min-w-10"/>
      </button>
      {onClickMenu && (
        <div className="text-sm absolute right-40  top-12 font-bold">
          <div className=" absolute  bg-blue-300  transition-transform shadow-md h-[12rem] w-[9rem] flex-col ">
            <p className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-gray-200 border-black">Home</p>
          <Link to="/signup/victim">  <p className="border-b-[0.5px] hover:bg-gray-200 pl-2 pt-2 pb-2 border-black">
            Signup as a Victim
            </p></Link>
            <p className="border-b-[0.5px] pl-2 hover:bg-gray-200 pt-2 pb-2 border-black">
              Become volunteer
            </p>
            <p className="border-b-[0.5px] hover:bg-gray-200 pl-2 pt-2 pb-2 border-black">
              Contact Us
            </p>
            <p className=" pl-2 pt-2 pb-2 hover:bg-gray-200 border-black">Log out</p>
          </div>
        </div>
      )}
      </div>
      <div className="md:flex lg:w-4/5 md:font-semibold md:items-center md:gap-10 lg:gap-14 lg:justify-center lg:items-center lg:pr-12 md:h-full md:pr-14  hidden sm:hidden "> 
        <button className="hover:bg-white focus:scale-110 hover:text-blue-400 hover:border-blue-400 hover:border-2 focus:border-2 focus:border-blue-400 focus:text-blue-400 focus:bg-white rounded-md bg-blue-400 text-white md:border transition-transform shadow-md  md:h-[50%] lg:h-[55%] lg:w-[6%] lg:text-sm md:w-[18%] text-center">Home</button>
        <button onClick={()=>setShowModal(true)} className="hover:bg-white focus:scale-110 hover:text-blue-400 hover:border-blue-400 hover:border-2 focus:border-2 focus:border-blue-400 focus:text-blue-400 focus:bg-white  rounded-md bg-blue-400 text-white md:border transition-transform shadow-md md:h-[50%] lg:h-[55%] lg:text-sm lg:w-[14%] md:w-[23%] md:leading-none lg:flex lg:justify-center lg:items-center md:pl-4 lg:p-0 text-center ">Become Volunteer</button>
       <button onClick={()=>setShowModal(true)} className="hover:bg-white focus:scale-110 hover:text-blue-400 hover:border-blue-400 hover:border-2 focus:border-2 focus:border-blue-400 focus:text-blue-400 focus:bg-white rounded-md bg-blue-400 text-white md:border transition-transform shadow-md leading-none lg:leading-none lg:h-[55%] lg:w-[14%] lg:text-sm md:h-[55%] md:w-[23%] lg:flex lg:justify-center lg:items-center md:pl-2 lg:p-0 md:pt-1 text-center ">Signup as a Victim</button>
        <button className="hover:bg-white focus:scale-110 hover:text-blue-400 hover:border-blue-400 hover:border-2 focus:border-2 focus:border-blue-400 focus:text-blue-400 focus:bg-white rounded-md bg-blue-400 text-white md:border transition-transform shadow-md md:h-[50%] lg:h-[55%] lg:text-sm lg:w-[6%]  md:w-[16%] text-center"> LogIn</button>
        <button className="hover:bg-white focus:scale-110 hover:text-blue-400 hover:border-blue-400 hover:border-2 focus:border-2 focus:border-blue-400 focus:text-blue-400 focus:bg-white rounded-md bg-blue-400 text-white md:border transition-transform shadow-md  md:h-[50%] lg:h-[55%] lg:text-sm lg:w-[9%] md:w-[21%] text-center">Contact Us</button>
      </div>
     
    </div>
  );
}
