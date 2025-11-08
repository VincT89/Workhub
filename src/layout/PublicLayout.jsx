import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; 
import bgLight from "../assets/bg/bg.jpg";
import bgDark from "../assets/bg/bgScuro.png";

import iconlogo from "../assets/logo/iconaLogo.png";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const PublicLayout = () => {
  const { theme } = useTheme();
  const bgImage = theme === "dark" ? bgDark : bgLight;

  return (
    <main
      className="relative w-full min-h-screen overflow-hidden transition-colors duration-500"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ===== BACKGROUND OVERLAY PRINCIPALE ===== */}
      <div
        className={`absolute top-[3%] left-[3%] w-[94%] h-[94%] rounded-[25px] border shadow-lg transition-all duration-500 ${
          theme === "dark"
            ? "bg-black/30 border-white/40 backdrop-blur-md"
            : "bg-glass border-white/30 backdrop-blur-md"
        }`}
      />

      {/* ===== LOGO in alto a sinistra ===== */}
      <div className="absolute top-[6.5%] left-[5%] flex justify-center items-center z-20">
        <div className="flex items-center bg-white/50 dark:bg-white/10 border border-white/40 rounded-full px-1 py-1 shadow-sm">
          <img
            src={iconlogo}
            alt="Logo"
            className="w-14 h-14 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* ===== COMPONENTI LAYOUT ===== */}
      <Topbar />
      <Sidebar />

      {/* ===== CONTENUTO CENTRALE (Outlet) ===== */}
      <section
        className={`absolute top-[16%] left-[10%] w-[80%] h-[70%] p-6 rounded-[25px] border shadow-md transition-all duration-500 overflow-hidden ${
          theme === "dark"
            ? "bg-glass-strong border-white/40 backdrop-blur-md"
            : "bg-glass border-white/30 backdrop-blur-sm"
        }`}
      >
        <Outlet />
      </section>

      <BottomNav />
    </main>
  );
};

export default PublicLayout;
