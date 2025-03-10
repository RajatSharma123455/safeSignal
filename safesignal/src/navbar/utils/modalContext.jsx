import { createContext  } from "react";
import { useState } from "react";

export const modalContext=createContext(false);

export default function SignupModal({children}){
    const [showModal,setShowModal]=useState(false);
    return(
    
        <modalContext.Provider value={{showModal,setShowModal}}>
            {children}
        </modalContext.Provider>
    )
}