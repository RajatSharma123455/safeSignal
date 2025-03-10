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
import SignupModal from './navbar/utils/modalContext.jsx'

const AppLayout=()=>{
 
  return(

    <StrictMode>
    <SignupModal>
    <Navbar/>
    
    <Outlet/>
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
  
]
},

])
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)