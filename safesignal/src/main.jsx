import { StrictMode } from 'react'
import React from 'react'
import ReactDOM from "react-dom/client"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './navbar/index.jsx'
import { createBrowserRouter,Outlet,RouterProvider } from 'react-router-dom'
import VictimForm from './victimForm.jsx'
import VolunteerForm from './VolunteerForm.jsx'
import SignupModal from './utils/signUpModalContext.jsx'
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpVolunteer from './navbar/signUpModal.jsx'
import LogInModal from './navbar/loginModal.jsx'
import ResetPassword from "./navbar/resetPassword.jsx"

const AppLayout=()=>{
 
  return(

    <StrictMode>
    <SignupModal>
    <Navbar/>
    <LogInModal/>
    <SignUpVolunteer/>
    <Outlet/>
    <ToastContainer/>
    </SignupModal>
  </StrictMode>
  );
}

const router= createBrowserRouter([
  {
  path:"/",
  element:<AppLayout/>,
  children:[
    {
    path:"/victim/form",
    element:<VictimForm/>
  },
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/volunteer/form",
    element:<VolunteerForm/>
  },
  {
    path:"/reset-password/:token",
    element:<ResetPassword/>
  },
]
},

])
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)