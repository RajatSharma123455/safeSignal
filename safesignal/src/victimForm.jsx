import { useEffect, useState } from "react"
import axios from "axios"


export default function VictimForm(){
    const [error,setError]=useState({});
    const [showLocation,setShowLocation]=useState(null);
   
    const [formData,setFormData]=useState({
      name:"",
      location:{
        type:"Point",
        coordinate:[]
        },
      disasterType:"",
      dateAndTime:"",
      immediateNeeds:"",
      numberOfPeople:"",
      medicalConditions:"",
      
     })


     useEffect(()=>{
     if(!navigator.geolocation){
        alert("Your browser does not support Automatic location")
        return

     }
     navigator.geolocation.getCurrentPosition(async (position)=>{
      const lat=position.coords.latitude;
      const long=position.coords.longitude;
     setFormData((prev)=>({...prev,location:{
      type:"point",
      coordinates:[long,lat],
     }}))
     
     try{
      const response= await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`);
      console.log("location",response.data.display_name);

      setShowLocation(response.data.display_name)

     }catch(error){
      console.error(" Not able to fetch address: ",error)
     }

    })

     },[])
    

   async function PostingVictimForm(){
        try{

    const response=await axios.post('http://localhost:3000/emergency/form',formData);
   

    if(response.status===200){
      console.log("successfully submitted",response.data)
    }
  }catch(error){
    if(error.response){
      console.error("error:",error.response.data)
    }else if(error.request){
      console.error("No response received from server")
    }else{
    console.error(error.message);
    }
  }
}
    

    let countError={};
    function Validation(){
      if(!formData.name || formData.name.length<=4 || formData.name.length>=50){
        countError.name="Name should be 4-50 characters";
      }
      if(!showLocation){
         countError.location=" Select allow to track your location "
      }
      setError(countError);
      return Object.keys(countError).length===0;  
    }

    function HandleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value})

    }

    function HandleSubmit(e){
      e.preventDefault();
      
      if(Validation()){
       
        PostingVictimForm();
        alert("successfully submitted")
        setFormData({
          name:"",
          location:{
            type:"point",
            coordinates:[]
          },
          disasterType:"",
          dateAndTime:"",
          immediateNeeds:"",
          numberOfPeople:"",
          medicalConditions:"",
         })
      }
     
    }

    return(
        <div className="flex flex-col h-100vh overscroll-x-none w-100vw bg-sky-100  justify-center items-center">

       <div className="h-[37rem] mb-4 py-2 sm:pt-8 lg:pt-4 mt-24 sm:w-4/5 w-[90%] lg:w-[51%] rounded-md transition-transform shadow-lg flex gap-4 sm:gap-4 bg-white border border-white/40 flex-col ">
        <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl  text-sky-800 font-bold">Victim Assistance Form</h1>
        <p className=" mt-2">We're here to support you. Please share your details below to get the help you need.</p>
        </div>
       
       <form onSubmit={HandleSubmit} className="mt-4 space-y-6" >

        <div className="flex justify-center">
        <input type="text" name="name" value={formData.name} placeholder="Full Name" onChange={(e)=>HandleChange(e)}  className="border border-gray-400 rounded-lg w-[90%]  py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200"  required></input>
        </div>

        <div className=" flex justify-center ">
        <input type="text" name="address" value={showLocation ? showLocation : ""} placeholder="Current Location" className="border border-gray-400 rounded-lg w-[90%] py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200" required ></input>
       {error.location && <p className="text-sm">{error.location}</p>}
        </div>

    <div className="md:flex w-[90%] gap-5 mx-auto ">
        <div className="flex flex-1">
        <select name="disasterType" value={formData.disasterType} required onChange={(e)=>HandleChange(e)} className="border  border-gray-400 rounded-lg w-full py-2 px-2 outline-none focus:border-sky-300 focus:border-2 transition duration-200">
        <option name="disasterType" value="" disabled selected> Disaster-Type</option>
        <option name="disasterType" value="Flood">Flood</option>
        <option name="disasterType" value="Cyclone">Cyclone</option>
        <option name="disasterType" value="Earthquake">Earthquake</option>
        <option name="disasterType" value="Draught">Draught</option>
        <option name="disasterType" value="Tsunami">Tsunami</option>
        <option name="disasterType" value="Landslde">Landslide</option>
        <option name="disasterType" value="Wildfire">Wildfire</option>
        <option name="disasterType" value="Avalanche">Avalanche</option>
        </select>
        </div>

        <div className="flex flex-1">
        <input type="datetime-local" name="dateAndTime" value={formData.dateAndTime} required  onChange={(e)=>HandleChange(e)} className="border border-gray-400 rounded-lg w-full py-2 px-2 outline-none focus:border-sky-300 focus:border-2 transition duration-200" ></input>
        </div>
        </div>

       <div className="md:flex w-[90%] gap-5 mx-auto">
        <div className="flex flex-[0.5] ">
        <select name="immediateNeeds" value={formData.immediateNeeds} required onChange={(e)=>HandleChange(e)}  className="border border-gray-400 rounded-lg w-full py-2 px-2 outline-none focus:border-sky-300 focus:border-2 transition duration-200">
            <option name="immediateNeeds" value="" className="text-gray-400" disabled selected>Immediate Needs</option>
            <option name="immediateNeeds" value="Food/water">Food and water</option>
            <option name="immediateNeeds" value="Shelter">Shelter</option>
            <option name="immediateNeeds" value="Medical assistance">Medical assistance</option>
            <option name="immediateNeeds" value="Clothing">Clothing</option>
            <option name="immediateNeeds" value="Hygiene kits">Hygiene kits</option>
        </select>
        </div>
         
        <div className="flex flex-[0.5]">
        <input type="number" name="numberOfPeople" value={formData.numberOfPeople} required onChange={(e)=>HandleChange(e)} placeholder="Number Of People" className="border border-gray-400 rounded-lg  w-full py-2 px-2 outline-none focus:border-sky-300 focus:border-2 transition duration-200"></input>
        </div>
        </div>
        
        <div className="flex justify-center w-full">
        <select name="medicalConditions" value={formData.medicalConditions} required onChange={(e)=>HandleChange(e)} className="border border-gray-400 rounded-lg flex-[0.9] py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200">
        <option name="medicalConditions" disabled selected>Medical Conditions</option>
            <option name="medicalConditions" value="Chronic illness">Chronic illness</option>
            <option name="medicalConditions" value="Disabilities">Disabilities</option>
            <option name="medicalConditions" value="Injuries">Injuries</option>
        </select>
        </div>

       <div className="flex justify-center w-full h-[12%] ">
       <button  className=" shadow-lg h-full mt-2 w-1/5 md:w-[90%] font-semibold bg-sky-500 hover:bg-sky-600  text-white rounded-lg" type="submit" >Submit Request</button> 
       </div>

       </form>
       
       </div>
        </div>
    )
}