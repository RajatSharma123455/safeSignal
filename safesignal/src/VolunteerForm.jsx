import { useEffect, useState } from "react";
import axios from "axios";

export default function VolunteerForm() {
  const [error, setError] = useState({});
  const [showLocation, setShowLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
   location:{
    type:"point",
    coordinates:[]
   },
    teamsize: "",
    dateAndTime: "",
    expertise: "",
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Your browser does not support Automatic location");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      setFormData((prev)=>({...prev,location:{
        type:"point",
        coordinates:[long,lat],
       }}))

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`
        );
        console.log("location", response.data.display_name);

        setShowLocation(response.data.display_name);
      } catch (error) {
        console.error(" Not able to fetch address: ", error);
      }
    });
  }, []);

  async function PostingSignup() {
    try {
      const response = await axios.post(
        "http://localhost:3000/volunteer/form",
        formData
      );

      if(response.status===200){
        console.log("successfully submitted",response.data)
      }
    } catch(error){
      if(error.response){
        console.error("error:",error.response.data)
      }else if(error.request){
        console.error("No response received from server")
      }else{
      console.error(error.message);
      }
  }
}

  let countError = {};
  function Validation() {
    if (!showLocation) {
      countError.location = " Select allow to track your location ";
    }
    if(!formData.teamsize || formData.teamsize>=1 || formData.teamsize<=1000){
      countError.teamsize="Enter the correct numbers of team member"
    }
    setError(countError);
    console.log("counet error", countError);
    return Object.keys(countError).length === 0;
  }
  console.log("error", error);

  function HandleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function HandleSubmit(e) {
    e.preventDefault();

    if (Validation()) {
      PostingSignup();
      alert("successfully submitted");
      setFormData({
        name: "",
        location:{
          type:"Point",
          coordinates:[]
        },
        teamsize: "",
        dateAndTime: "",
        expertise: "",
      });
    }
  }

  return (
    <div className="flex flex-col h-full overscroll-x-none bg-sky-100  justify-center items-center">
      <div className="h-[35rem] mb-4 py-2 sm:pt-8 lg:pt-4 mt-24 sm:w-4/5 w-[90%] lg:w-[50%] rounded-md transition-transform shadow-lg flex gap-4 sm:gap-4 bg-white border border-white/40 flex-col ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl  text-sky-800 font-bold">
            Join Us - Volunteer Registration
          </h1>
          <p className=" mt-2">
            Join our volunteer team and provide critical support when it matters
            most.
          </p>
        </div>

        <form onSubmit={HandleSubmit} className="mt-4 space-y-6">
          <div className="flex justify-center">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => HandleChange(e)}
              className="border border-gray-400 rounded-lg w-[90%]  py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200"
              placeholder="Individual/NGO Name"
              required
            ></input>
          </div>

          <div className=" flex justify-center ">
            <input
              type="text"
              name="address"
              value={showLocation ? showLocation : ""}
              placeholder="Current Location"
              className="border border-gray-400 rounded-lg w-[90%] py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200"
              required
            ></input>
            {error.location && <p className="text-sm">{error.location}</p>}
          </div>

          <div className=" flex justify-center ">
            <input
              type="number"
              name="teamsize"
              value={formData.teamsize}
              onChange={(e) => HandleChange(e)}
              placeholder="Team Size"
              className="border border-gray-400 w-[90%] rounded-lg  py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200"
              required
            ></input>
          </div>

          <div className="flex justify-center items-center gap-6 ">
            <p>Date & Time:</p>
            <input
              type="datetime-local"
              name="dateAndTime"
              value={formData.dateAndTime}
              required
              onChange={(e) => HandleChange(e)}
              className="border border-gray-400 w-[70%] rounded-lg  py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200"
            ></input>
          </div>

          <div className="flex justify-center ">
            <select
              name="expertise"
              value={formData.expertise}
              onChange={(e) => HandleChange(e)}
              required
              className="border border-gray-400 w-[90%] rounded-lg  py-2 px-3 outline-none focus:border-sky-300 focus:border-2 transition duration-200"
            >
              <option name="expertise" value="" disabled selected>
                Area Of Support
              </option>
              <option name="expertise" value="Medical & Health Services">
                Medical and Health Services
              </option>
              <option name="expertise" value="Search & Rescue">
                Search and Rescue
              </option>
              <option name="expertise" value="Shelter support">
                Shelter support
              </option>
              <option name="expertise" value="Food & Water">
                Food and Water
              </option>
              <option name="expertise" value="Communication & IT">
                Communication and IT
              </option>
              <option name="expertise" value="Logistics and Transportation">
              Logistics and Transportation
              </option>
            </select>
          </div>

          <div className="flex justify-center w-full h-[15%] ">
            <button
              className=" shadow-lg h-full mt-2 w-1/5 md:w-[90%] font-semibold bg-sky-500 hover:bg-sky-600  text-white rounded-lg"
              type="submit"
            >
              Become a Volunteer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
