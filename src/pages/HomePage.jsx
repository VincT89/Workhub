import React from "react";
import bgImage from "../assets/bg/bg.jpg";
import Logo from "../assets/logo/LogoCompletoSenzaBG.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="bg-white w-full min-h-screen relative overflow-hidden">
      {/* Background  */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Background gradient"
        src={bgImage}
      />

      {/* Liquid Glass Overlay - div che crea l'effetto */}
      <div
        className="absolute top-[5%] left-[10%] w-[80%] max-w-[90%] h-[90%] bg-[#fafafa20] backdrop-blur-sm rounded-[25px] border border-solid shadow-lg border-neutral-50/30 "
      />

      {/* Logo */}
      <img
        className="absolute top-[35%] left-1/2 transform -translate-x-1/2 w-[60%] max-w-[499px] h-auto aspect-[1.82] object-cover"
        alt="WorkHub logo"
        src={Logo}
      />

      {/* Frase */}
      <h1 className="absolute top-[55%] left-[58%] transform -translate-x-1/2 text-[#1c629f] text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-normal leading-normal whitespace-nowrap">
        Simplify your workflow
      </h1>

      {/* Bottone di Benvenuto */}
      <Link to="/login"
        className="absolute top-[68%] left-1/2 transform -translate-x-1/2 w-[80%] max-w-[350px] h-14 bg-[#fafafa30] backdrop-blur-sm rounded-2xl border border-solid shadow-lg border-neutral-50/30 text-[#1c629f] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-normal leading-normal flex items-center justify-center cursor-pointer hover:bg-[#fafafa50] transition-colors duration-300"
        role="button"
      >
        Benvenuto
      </Link>
    </main>
  );
};

export default HomePage;
