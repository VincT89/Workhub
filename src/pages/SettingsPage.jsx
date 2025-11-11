import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCredentials } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import bgLight from "../assets/bg/bg.jpg";
import bgDark from "../assets/bg/bgScuro.png";
import iconLogo from "../assets/logo/iconaLogo.png";
import italianFlag from "../assets/icons/Italy.png";
import englishFlag from "../assets/icons/Great Britain.png";
import darkIcon from "../assets/icons/Do not Disturb iOS.png";
import lightIcon from "../assets/icons/Sun.png";
import eyes from "../assets/icons/closedEye.png";
import eyes2 from "../assets/icons/Eye.png";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [username, setUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    if (!username) {
      setMessage(t("settings.inserisciUsername"));
      setMessageType("error");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage(t("settings.passwordNonCoincidono"));
      setMessageType("error");
      return;
    }

    dispatch(
      updateCredentials({
        username,
        password: newPassword || user?.password,
      })
    );

    setMessage(t("settings.modificheSalvate"));
    setMessageType("success");

    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const backgroundImage = theme === "dark" ? bgDark : bgLight;
  const textColor = theme === "dark" ? "text-white" : "text-[#1C62A0]";
  const labelColor = theme === "dark" ? "text-white" : "text-[#1C62A0]";

  return (
    <main
      className="w-full min-h-screen flex justify-center items-center relative overflow-hidden 
      bg-white dark:bg-black transition-colors duration-500"
    >
      {/* Background dinamico */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Liquid Glass Overlay */}
      <div
        className="absolute w-[50%] h-[90%] 
        bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm 
        border border-white/30 dark:border-white/40 rounded-[25px] shadow-md"
      />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-[800px] flex flex-col items-center px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-2">
          <img src={iconLogo} alt="Logo" className="w-20 h-20" />
          <h1
            className={`text-3xl font-bold font-nunito uppercase transition-colors duration-500 ${textColor}`}
          >
            {t("settings.impostazioni")}
          </h1>
        </div>

        {/* SEZIONE 1 — CREDENZIALI */}
        <section
          className="w-full p-6 rounded-[25px] shadow-md border border-white/30 
          bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm transition-all duration-500"
        >
          <h2
            className={`${textColor} text-xl font-bold mb-4 border-b border-[#1C62A0] pb-2`}
          >
            {t("settings.account")}
          </h2>

          {message && (
            <p
              className={`${
                messageType === "success" ? "text-[#1C62A0]" : "text-red-500"
              } text-center font-bold mb-4 transition-opacity duration-500`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label
                className={`block text-[18px] font-bold font-nunito mb-2 ${labelColor}`}
              >
                {t("settings.username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
                rounded-2xl px-4 shadow-md outline-none text-[#134a7b] font-semibold
                focus:ring-2 focus:ring-[#1C62A0]/50 placeholder:text-[#134a7b]/70 transition-all duration-200"
              />
            </div>

            {/* Nuova password */}
            <div className="relative">
              <label
                className={`block text-[18px] font-bold font-nunito mb-2 ${labelColor}`}
              >
                {t("settings.nuovaPassword")}
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
                rounded-2xl px-4 pr-12 shadow-md outline-none text-[#134a7b] font-semibold
                focus:ring-2 focus:ring-[#1C62A0]/50 placeholder:text-[#134a7b]/70 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((s) => !s)}
                className="absolute top-[70%] right-4 transform -translate-y-1/2 w-[30px] h-[30px] cursor-pointer"
              >
                <img
                  src={showNewPassword ? eyes2 : eyes}
                  alt="Toggle password visibility"
                  className="w-[25px] h-[25px] select-none pointer-events-none mt-1"
                />
              </button>
            </div>

            {/* Conferma password */}
            <div className="relative">
              <label
                className={`block text-[18px] font-bold font-nunito mb-2 ${labelColor}`}
              >
                {t("settings.confermaPassword")}
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
                rounded-2xl px-4 pr-12 shadow-md outline-none text-[#134a7b] font-semibold
                focus:ring-2 focus:ring-[#1C62A0]/50 placeholder:text-[#134a7b]/70 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute top-[70%] right-4 transform -translate-y-1/2 w-[30px] h-[30px] cursor-pointer mt-1"
              >
                <img
                  src={showConfirmPassword ? eyes2 : eyes}
                  alt="Toggle password visibility"
                  className="w-[25px] h-[25px] select-none pointer-events-none"
                />
              </button>
            </div>
          </form>
        </section>

        {/* SEZIONE 2 — ASPETTO */}
        <section
          className="w-full p-6 rounded-[25px] shadow-md border border-white/30 
          bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm transition-all duration-500"
        >
          <h2
            className={`${textColor} text-xl font-bold mb-4 border-b border-[#1C62A0] pb-2`}
          >
            {t("settings.aspetto")}
          </h2>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Tema */}
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <span className={`${labelColor} font-semibold mb-1`}>
                {t("settings.tema")}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-300 ${
                    theme === "light"
                      ? "border-[#1C62A0] bg-[rgba(217,217,217,0.3)]"
                      : "border-gray-300 dark:border-white/30"
                  }`}
                >
                  <img src={lightIcon} alt="Light" className="w-6 h-6" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-300 ${
                    theme === "dark"
                      ? "border-[#1C62A0] bg-[rgba(217,217,217,0.3)]"
                      : "border-gray-300 dark:border-white/30"
                  }`}
                >
                  <img src={darkIcon} alt="Dark" className="w-6 h-6" /> Dark
                </button>
              </div>
            </div>

            {/* Lingua */}
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <span className={`${labelColor} font-semibold mb-1`}>
                {t("settings.lingua")}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => toggleLang("it")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-300 ${
                    lang === "it"
                      ? "border-[#1C62A0] bg-[rgba(217,217,217,0.3)]"
                      : "border-gray-300 dark:border-white/30"
                  }`}
                >
                  <img src={italianFlag} alt="Italiano" className="w-6 h-6" />
                  {t("settings.italiano")}
                </button>
                <button
                  type="button"
                  onClick={() => toggleLang("en")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-300 ${
                    lang === "en"
                      ? "border-[#1C62A0] bg-[rgba(217,217,217,0.3)]"
                      : "border-gray-300 dark:border-white/30"
                  }`}
                >
                  <img src={englishFlag} alt="Inglese" className="w-6 h-6" />
                  {t("settings.inglese")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 3 — AZIONI */}
        <section className="w-full flex flex-col sm:flex-row justify-center gap-6 mt-2">
          <button
            type="submit"
            onClick={handleSave}
            className="w-full sm:w-[200px] py-3 font-bold rounded-2xl shadow-md border border-white/20 
            bg-[#1C62A0] text-white hover:bg-[#155293] transition-colors duration-300"
          >
            {t("settings.salvaModifiche")}
          </button>
          <Link
            to="/login"
            className="w-full sm:w-[200px] py-3 text-center font-bold rounded-2xl shadow-md border border-white/20 
            bg-[#1C62A0] text-white hover:bg-[#155293] transition-colors duration-300"
          >
            {t("settings.esci")}
          </Link>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
