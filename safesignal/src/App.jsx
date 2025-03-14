
import HeroSection from "./HeroSection";
import Map from "./Component/map";

function App() {
  return (
    <div className="relative ">
      {/* <div className="absolute w-[100%] h-[100%] flex"> */}
      <HeroSection />
      
      <div className="bg-blue-50 flex justify-center pt-4">
        <Map />
      </div>
    </div>
  );
}
export default App;
