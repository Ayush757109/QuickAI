import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundImage: `url("/gradientBackground1.png")` }}
      className="px-4 sm:px-20 xl:px-32 relative flex flex-col w-full 
      justify-center items-center bg-cover bg-center bg-no-repeat min-h-screen"
    >
      <div className="text-center">
        <h1
  className="
    text-10xl 
    sm:text-7xl 
    md:text-7xl 
    lg:text-8xl 
    xl:text-9xl 
    font-bold leading-tight
  "
>
  Create  Amazing Content <br />
  with <span className="text-blue-700">AI Tools</span>
</h1>


        <p className="mt-14 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto text-gray-600 max-sm:text-xs">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs mt-6">
        <button
          className="text-blue-600 px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition cursor-pointer bg-white"
          onClick={() => navigate("/ai")}
        >
          Start Creating Now
        </button>

        <button className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition cursor-pointer">
          Watch Demo
        </button>
      </div>

      <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600">
        <img src={assets.user_group} alt="" className="h-8" /> Trusted by 10k+ people
      </div>
    </div>
  );
};

export default Hero;
