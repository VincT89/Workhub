import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg/bg.jpg";
import iconLogo from "../assets/logo/iconaLogo.png";
import italianFlag from "../assets/icons/Italy.png";
import englishFlag from "../assets/icons/Great Britain.png";
import dark from "../assets/icons/Do not Disturb iOS.png";
import light from "../assets/icons/Sun.png";

const SettingsPage = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("it");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!username) return alert("Inserisci uno username.");
    if (newPassword && newPassword !== confirmPassword)
      return alert("Le password non coincidono.");
    alert(" Modifiche salvate.");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="relative w-full min-h-screen bg-white flex justify-center items-center overflow-hidden">
      {/* Background */}
      <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute w-[50%] h-[90%] bg-[#fafafa20] backdrop-blur-md rounded-[40px] border border-white/30 shadow-lg" />

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-[800px] flex flex-col items-center px-6 py-10 space-y-10">

        {/* Header */}
        <div className="flex items-center gap-2">
          <img src={iconLogo} alt="Logo" className="w-20 h-20" />
          <h1 className="text-[#1C62A0] text-3xl font-bold font-nunito">Impostazioni</h1>
        </div>

        {/* SEZIONE 1 — CREDENZIALI */}
        <section className="w-full bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-[#1C62A0] text-xl font-bold mb-4 border-b border-[#1C62A0]/50 pb-2">
             Gestione Account
          </h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="text-[#1C62A0] font-semibold block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-1 rounded-xl border border-gray-300 bg-[#D9D9D9]/60 text-[#1C62A0] outline-none"
              />
            </div>
            <div>
              <label className="text-[#1C62A0] font-semibold block mb-1">Nuova password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-1 rounded-xl border border-gray-300 bg-[#D9D9D9]/60 text-[#1C62A0] outline-none"
              />
            </div>
            <div>
              <label className="text-[#1C62A0] font-semibold block mb-1">Conferma password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-1 rounded-xl border border-gray-300 bg-[#D9D9D9]/60 text-[#1C62A0] outline-none"
              />
            </div>
          </form>
        </section>

        {/* SEZIONE 2 — ASPETTO */}
        <section className="w-full bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-[#1C62A0] text-xl font-bold mb-4 border-b border-[#1C62A0]/50 pb-2">
             Aspetto
          </h2>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Tema */}
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <span className="text-[#1C62A0] font-semibold mb-1">Tema</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                    theme === "light" ? "border-[#1C62A0] bg-[#D9D9D9]/40" : "border-gray-300"
                  }`}
                >
                  <img src={light} alt="Light" className="w-6 h-6" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                    theme === "dark" ? "border-[#1C62A0] bg-[#D9D9D9]/40" : "border-gray-300"
                  }`}
                >
                  <img src={dark} alt="Dark" className="w-6 h-6" /> Dark
                </button>
              </div>
            </div>

            {/* Lingua */}
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <span className="text-[#1C62A0] font-semibold mb-1">Lingua</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage("it")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                    language === "it" ? "border-[#1C62A0] bg-[#D9D9D9]/40" : "border-gray-300"
                  }`}
                >
                  <img src={italianFlag} alt="Italiano" className="w-6 h-6" /> Italiano
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                    language === "en" ? "border-[#1C62A0] bg-[#D9D9D9]/40" : "border-gray-300"
                  }`}
                >
                  <img src={englishFlag} alt="Inglese" className="w-6 h-6" /> English
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 3 — AZIONI */}
        <section className="w-full flex flex-col sm:flex-row justify-center gap-6 mt-2">
          <button
            onClick={handleSave}
            className="w-full sm:w-[200px] py-3 bg-[#1C62A0] text-white font-bold rounded-2xl shadow-md hover:bg-[#154d7d] transition"
          >
             Salva modifiche
          </button>
          <Link
            to="/login"
            className="w-full sm:w-[200px] py-3 bg-[#FF3B3F] text-white font-bold rounded-2xl shadow-md hover:bg-[#d63134] transition text-center"
          >
             Esci
          </Link>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
