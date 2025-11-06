import React from "react";
import bgImage from "../assets/bg/bg.jpg";
import Logo from "../assets/logo/LogoCompletoSenzaBG.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="main-container bg-white">
      {/* Background */}
      <img
        className="overlay-full"
        alt="Background gradient"
        src={bgImage}
      />

      {/* Liquid Glass Overlay */}
      <div
        className="absolute top-[5%] left-[10%] w-[80%] max-w-[90%] h-[90%] glass-card shadow-lg"
      />

      {/* Logo */}
      <img
        className="absolute top-[35%] left-1/2 transform -translate-x-1/2 w-[60%] max-w-[499px] h-auto aspect-[1.82] object-cover"
        alt="WorkHub logo"
        src={Logo}
      />

      {/* Frase */}
      <h1 className="absolute top-[55%] left-[58%] transform -translate-x-1/2 text-primary text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-normal leading-normal whitespace-nowrap">
        Simplify your workflow
      </h1>

      {/* Bottone di Benvenuto */}
      <Link
        to="/login"
        role="button"
        className="absolute top-[68%] left-1/2 transform -translate-x-1/2 w-[80%] max-w-[350px] h-14 glass-card flex items-center justify-center text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-normal leading-normal cursor-pointer hover:bg-glass-strong transition-colors duration-300"
      >
        Benvenuto
      </Link>
    </main>
  );
};

export default HomePage;
