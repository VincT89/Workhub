import React, { useState, useEffect } from "react";
import bgImage from "../assets/bg/bg.jpg";
import iconLogo from "../assets/logo/iconaLogo.png";
import italianFlag from "../assets/icons/Italy.png";
import englishFlag from "../assets/icons/Great Britain.png";
import dark from "../assets/icons/Do not Disturb iOS.png";
import light from "../assets/icons/Sun.png";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("it");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!username) {
      alert("Inserisci uno username.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }
    alert("Modifiche salvate.");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    
  };

  return (
    <main className="bg-white w-full min-h-screen relative overflow-hidden flex justify-center items-center">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        alt="Background"
        src={bgImage}
      />
      <div className="absolute w-[55%] h-[70%] bg-[#fafafa20] backdrop-blur-sm rounded-[40px] border border-neutral-50/30 z-10" />
      <div className="relative flex flex-col items-center z-20 w-full max-w-[650px] sm:max-w-[50%] px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <img className="w-[90px] h-[85px]" alt="Logo" src={iconLogo} />
          <div className="text-center">
            <span className="text-[#1C62A0] text-2xl font-bold font-nunito">
              Impostazioni
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="w-full flex flex-col sm:flex-row gap-6">
          {/* Left Column: Reset Password */}
          <div className="w-full sm:w-1/2 pb-6 border-b border-[#1C62A0]">
            <div className="text-[#1C62A0] text-[18px] font-bold font-nunito mb-4">
              Reset Password
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="relative w-full">
                <label
                  htmlFor="username"
                  className="block text-[#1C62A0] text-[16px] font-bold font-nunito mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-[80%] h-8 bg-[#D9D9D9]/30 shadow-md border border-[#FBFBFB] rounded-2xl px-4 text-[#1C62A0] outline-none"
                  aria-label="Username"
                />
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="new-password"
                  className="block text-[#1C62A0] text-[16px] font-bold font-nunito mb-2"
                >
                  Nuova password
                </label>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-[80%] h-8 bg-[#D9D9D9]/30 shadow-md border border-[#FBFBFB] rounded-2xl px-4 text-[#1C62A0] outline-none"
                  aria-label="Nuova password"
                />
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="confirm-password"
                  className="block text-[#1C62A0] text-[16px] font-bold font-nunito mb-2"
                >
                  Conferma password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-[80%] h-8 bg-[#D9D9D9]/30 shadow-md border border-[#FBFBFB] rounded-2xl px-4 text-[#1C62A0] outline-none"
                  aria-label="Conferma password"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Theme and Language */}
          <div className="w-full sm:w-1/2 pb-6 border-b border-[#1C62A0]">
            <div className="flex flex-col gap-6">
              {/* Theme Selection */}
              <div className="flex flex-col gap-4 items-end">
                <div className="text-[#1C62A0] text-[18px] font-bold font-nunito mb-2">
                  Tema
                </div>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  aria-pressed={theme === "light"}
                  className={`w-[70%] h-9 flex justify-start items-center bg-[#D9D9D9]/30 shadow-md border-2 rounded-2xl p-3 transition-colors ${
                    theme === "light" ? "border-[#1C62A0]" : "border-[#FBFBFB]"
                  }`}
                >
                  <img
                    className="w-7 h-7 mx-2"
                    src={light}
                    alt="Icona tema chiaro"
                  />
                  <span className="text-[#1C62A0] text-[16px] font-bold font-nunito">
                    Light
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  aria-pressed={theme === "dark"}
                  className={`w-[70%] h-9 flex justify-start items-center bg-[#D9D9D9]/30 shadow-md border-2 rounded-2xl p-3 transition-colors ${
                    theme === "dark" ? "border-[#1C62A0]" : "border-[#FBFBFB]"
                  }`}
                >
                  <img
                    className="w-7 h-7 mx-2"
                    src={dark}
                    alt="Icona tema scuro"
                  />
                  <span className="text-[#1C62A0] text-[16px] font-bold font-nunito">
                    Dark
                  </span>
                </button>
              </div>

              {/* Language Selection */}
              <div className="flex flex-col gap-4 items-end">
                <div className="text-[#1C62A0] text-[18px] font-bold font-nunito mb-2">
                  Lingua
                </div>
                <button
                  type="button"
                  onClick={() => setLanguage("it")}
                  aria-pressed={language === "it"}
                  className={`w-[70%] h-9 flex justify-start items-center bg-[#D9D9D9]/30 shadow-md border-2 rounded-2xl p-3 transition-colors ${
                    language === "it" ? "border-[#1C62A0]" : "border-[#FBFBFB]"
                  }`}
                >
                  <img
                    className="w-7 h-7 mx-2"
                    src={italianFlag}
                    alt="Bandiera italiana"
                  />
                  <span className="text-[#1C62A0] text-[16px] font-bold font-nunito">
                    Italiano
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={language === "en"}
                  className={`w-[70%] h-9 flex justify-start items-center bg-[#D9D9D9]/30 shadow-md border-2 rounded-2xl p-3 transition-colors ${
                    language === "en" ? "border-[#1C62A0]" : "border-[#FBFBFB]"
                  }`}
                >
                  <img
                    className="w-7 h-7 mx-2"
                    src={englishFlag}
                    alt="Bandiera inglese"
                  />
                  <span className="text-[#1C62A0] text-[16px] font-bold font-nunito">
                    Inglese
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-20 mt-10 w-full">
          <button
            type="submit"
            className="w-full sm:w-[200px] py-2 bg-[#1C62A0] shadow-md border border-[#FBFBFB] rounded-2xl flex items-center justify-center hover:bg-[#154d7d] transition-colors"
          >
            <span className="text-[#FBFBFB] text-[16px] font-bold font-nunito">
              Salva modifiche
            </span>
          </button>
          <Link
            to="/login"
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-[200px] py-2 bg-[#FF3B3F] shadow-md border border-[#FBFBFB] rounded-2xl flex items-center justify-center hover:bg-[#d63134] transition-colors"
          >
            <span className="text-[#FBFBFB] text-[16px] font-bold font-nunito">
              Esci
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
