
import BackgroundSetter from "./background/background";

import HeroSection from "./HeroSection";
import Map from "./Component/map";
import SignUpVolunteer from "./navbar/signUpVolunteer";

 function App(){
  return(
  <div className="relative ">
  
  <div className="absolute">
  <HeroSection/>
  <SignUpVolunteer/>
  </div>
    <BackgroundSetter/>
  <div className="bg-blue-50 flex justify-center pt-4">

  <Map/>
  </div>
  </div>
  )
 }export default App