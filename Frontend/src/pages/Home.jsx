import React, { useEffect, useState } from "react";
import HeroMain from "../components/Hero/HeroMain";
import MainCategorySlider from "../components/homepage/MainCategorySlider";
const Home = () => {
  return (
    <div className="w-full min-h-screen relative transition-colors duration-500 overflow-x-hidden">
      <HeroMain />
      <MainCategorySlider />
    </div>
  );
};

export default Home;
