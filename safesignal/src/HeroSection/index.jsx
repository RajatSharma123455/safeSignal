
export default function HeroSection(){



    return(
      // <div >
      //   <div className="p-2  lg:ml-40 xl:ml-64 transition-transform shadow-sm  rounded-md  leading-10 text-Black sm:w-4/5 sm:ml-20 w-4/5 ml-10 md:w-3/4 sm:translate-y-32 translate-y-40 md:ml-32 md:translate-y-32 lg:translate-y-40  ">
      //     <h1 className="font-extrabold md:pl-12 lg:text-3xl md:text-xl sm:text-xl text-xl lg:pl-8   font-sans">Real-Time Disaster Assistance at Your Fingertips</h1>
      //     <div className=" pl-4 w-[100%] mt-2 flex justify-center">
      //     <h4 className="  font-sans rounded-md text-lg text-blue-800  font-semibold">Get real-time updates, report incidents, and find help when you need it most.</h4>
      //     </div>
      //     <div className=" flex mt-4 justify-center space-x-8  ">
      //    <Link to="/victim/form" className=" text-white bg-red-500 transition-transform shadow-lg rounded-md md:px-4 md:py-1 px-2 lg:px-4 lg:py-1 ">Get Help Now</Link> 
      //    <Link to="/volunteer/form" className=" text-white rounded-md bg-blue-500 transition-transform shadow-lg md:px-4 md:py-1   lg:px-4 lg:py-1 px-2 ">Become Volunteer</Link>
      //     </div>
          
      //   </div>
      //   </div>
      <div className="relative flex justify-center items-center">
  <div className="p-4 border border-black lg:ml-10 xl:mx-[18rem] 2xl:min-mx-[30rem] shadow-sm rounded-md leading-10 text-black 
                  sm:w-4/5 md:w-3/4 lg:w-3/4 w-4/5 max-w-2xl 
                 translate-y-[10rem] sm:translate-y-[15rem] md:translate-y-[11rem] lg:translate-y-[10rem] xl:translate-y-[10rem]  transition-transform">

    <h1 className="font-extrabold text-center lg:text-3xl md:text-xl sm:text-xl text-xl font-sans">
      Real-Time Disaster Assistance at Your Fingertips
    </h1>

    <div className="pl-4 w-full mt-2 flex justify-center">
      <h4 className="font-sans rounded-md text-lg text-blue-800 font-semibold text-center">
        Get real-time updates, report incidents, and find help when you need it most.
      </h4>
    </div>

    <div className="flex mt-4 justify-center space-x-8">
      <button to="/victim/form" className="text-white bg-red-500 shadow-lg rounded-md md:px-4 md:py-1 px-2 lg:px-4 lg:py-1">
        Get Help Now
      </button> 
      <button className="text-white rounded-md bg-blue-500 shadow-lg md:px-4 md:py-1 lg:px-4 lg:py-1 px-2">
        Become Volunteer
      </button>
    </div>

  </div>
</div>

      
    )
}