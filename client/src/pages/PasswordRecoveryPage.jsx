import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";

import { recoverPasswordAsync } from "../store/feature/authSlice";

import bgLight from "../assets/bg/bg.jpg";
import bgDark from "../assets/bg/bgScuro.jpg";
import { Sun, Moon } from "@phosphor-icons/react";

const PasswordRecoveryPage = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const { recoveryLoading, recoveryError, recoveryMessage } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const backgroundImage = theme === "dark" ? bgDark : bgLight;

  const handleRecovery = (e) => {
    e.preventDefault();
    dispatch(recoverPasswordAsync({ email, username }));
  };

  // MOSTRA LA PASSWORD TEMP IN CONSOLE
  useEffect(() => {
    if (recoveryMessage?.tempPassword) {
      console.log("PASSWORD TEMPORANEA:", recoveryMessage.tempPassword);
    }
  }, [recoveryMessage]);

  const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";
  const labelColor = textColor;

  return (
    <main className="w-full min-h-screen flex justify-center items-center relative overflow-hidden transition-colors duration-500">
      <img className="absolute inset-0 w-full h-full object-cover z-0" src={backgroundImage} />

      <div className="relative z-20 w-full sm:w-[480px] flex flex-col items-center px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className={`text-3xl font-bold uppercase ${textColor}`}>
            {t("auth.recover.recuperaPassword")}
          </h1>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-white/30 hover:bg-[#1C62A0]/10"
          >
            {theme === "dark" ? (
              <Moon size={30} color="white" weight="duotone" />
            ) : (
              <Sun size={30} color="#090c64" weight="duotone" />
            )}
          </button>
        </div>

        {/* CARD */}
        <section className="w-full p-6 rounded-[25px] shadow-md border border-white/90 bg-white/10 dark:bg-white/10 backdrop-blur-sm">

          <h2 className={`${textColor} text-xl font-bold mb-4 pb-2 border-b border-[#090c64]`}>
            {t("auth.recover.inserisciDati")}
          </h2>

          {/* MESSAGGI */}
          {recoveryError && (
            <p className="text-red-500 font-bold text-center mb-4">
              {recoveryError}
            </p>
          )}

          {recoveryMessage && (
            <p className="text-green-500 font-bold text-center mb-4">
              {t("auth.recover.emailInviata")} {recoveryMessage.email}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleRecovery} className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <label className={`${labelColor} text-[18px] font-bold mb-2`}>
                {t("auth.recover.username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("auth.recover.inserisciUsername")}
                className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 rounded-2xl px-4 shadow-md"
              />
            </div>

            {/* Email */}
            <div>
              <label className={`${labelColor} text-[18px] font-bold mb-2`}>
                {t("auth.recover.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.recover.inserisciEmail")}
                className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 rounded-2xl px-4 shadow-md"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={recoveryLoading}
              className="w-full mt-4 py-3 font-bold rounded-2xl shadow-md bg-[#090c64] text-white hover:scale-[1.02] transition"
            >
              {recoveryLoading
                ? t("auth.recover.invioInCorso")
                : t("auth.recover.inviaRichiesta")}
            </button>

            <Link
              to="/login"
              className={`text-center mt-3 ${textColor} font-semibold hover:underline`}
            >
              {t("auth.recover.tornaLogin")}
            </Link>
          </form>
        </section>
      </div>
    </main>
  );
};

export default PasswordRecoveryPage;
