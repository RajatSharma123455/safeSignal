import { createContext  } from "react";
import { useState } from "react";

export const modalContext=createContext(false);

export default function SignupModalContext({children}){
    const [showModal,setShowModal]=useState(false);
    const [logInContext,setLogInContext]=useState(false)
    return(
    
        <modalContext.Provider value={{showModal,setShowModal,logInContext,setLogInContext}}>
            {children}
        </modalContext.Provider>
    )
}