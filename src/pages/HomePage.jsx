import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import bgLight from "../assets/bg/bg3.jpg";
import bgDark from "../assets/bg/bgScuro3.jpg";
import Logo from "../assets/logo/LogoCompletoSenzaBG.png";
import logoDark from "../assets/logo/logoVuoto.png";

const HomePage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const backgroundImage = theme === "dark" ? bgDark : bgLight;
  const textColor = theme === "dark" ? "text-white" : "text-[#080ebf]";

  return (
    <main
      className="w-full min-h-screen flex justify-center items-center relative overflow-hidden 
      bg-white dark:bg-black transition-colors duration-500"
    >
      {/* Background */}
      <img
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        alt="Background gradient"
        src={backgroundImage}
      />

      {/* Liquid Glass Overlay */}
      <div
        className="absolute top-[5%] left-[10%] w-[80%] max-w-[90%] h-[90%] transition-all duration-500"
      />

      {/* Logo */}
      <img
        className="absolute top-[35%] left-1/2 transform -translate-x-1/2 
        w-[60%] max-w-[499px] h-auto aspect-[1.82] object-cover"
        alt="WorkHub logo"
        src={theme === "dark" ? logoDark : Logo}
      />

      {/* Frase */}
      <h1
        className={`absolute top-[55%] left-[58%] transform -translate-x-1/2 
        text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-normal 
        leading-normal whitespace-nowrap transition-colors duration-500 ${textColor}`}
      >
        {t("home.slogan")}
      </h1>

      {/* Bottone di Benvenuto */}
      <Link
        to="/login"
        role="button"
        className={`absolute top-[68%] left-1/2 transform -translate-x-1/2 
        w-[80%] max-w-[350px] h-14 flex items-center justify-center 
        text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-normal leading-normal 
        bg-white/20 dark:bg-white/10 backdrop-blur-sm border rounded-xl border-white/30 dark:border-white/90 
        cursor-pointer transition-colors duration-300 ${textColor} 
        hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-lg`}
      >
        {t("home.benvenuto")}
      </Link>
    </main>
  );
};

export default HomePage;
