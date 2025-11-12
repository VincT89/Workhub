import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import bgLight from "../assets/bg/bg3.jpg";
import bgDark from "../assets/bg/bgScuro.png";
import iconLogo from "../assets/logo/iconaLogo.png";
import eyes from "../assets/icons/closedEye.png";
import eyes2 from "../assets/icons/Eye.png";

const LoginPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const backgroundImage = theme === "dark" ? bgDark : bgLight;

  // Se già loggato → vai alla dashboard
  useEffect(() => {
    if (token && user) {
      navigate("/dashboard");
    }
  }, [token, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(loginAsync({ username, password }));
  };

  const textColor = theme === "dark" ? "text-white" : "text-[#1C62A0]";

  return (
    <main
      className="w-full min-h-screen flex justify-center items-center relative overflow-hidden 
      bg-white dark:bg-black transition-colors duration-500"
    >
      {/* ===== Background ===== */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
        alt="Background"
        src={backgroundImage}
      />

      {/* ===== Liquid Glass Overlay ===== */}
      <div
        className="absolute w-[822px] h-[659px] 
        bg-[#fafafa20] dark:bg-[#fafafa20] backdrop-blur-sm 
        border border-white/30 dark:border-white/90 rounded-[25px] shadow-md
        transition-all duration-700"
      />

      {/* ===== Form Content ===== */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center z-20 w-full max-w-[822px] px-6 py-10"
      >
        {/* === Logo + Titolo === */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <Link to="/">
            <img
              className="w-[120px] h-[114px] drop-shadow-lg transition-transform duration-300 hover:scale-105"
              alt="Logo"
              src={iconLogo}
            />
          </Link>

          <div className="text-center">
            <span
              className={`text-4xl font-bold font-nunito uppercase transition-colors duration-500 ${textColor}`}
            >
              {t("login.titolo")}
            </span>
            <br />
            <span
              className={`font-bold font-nunito text-sm transition-colors duration-500 ${textColor}`}
            >
              {t("login.credenzialiDemo")}
            </span>
          </div>
        </div>

        {/* === Messaggio di errore === */}
        {error && (
          <p className="text-[#DC2626] font-bold mt-3 mb-2 animate-pulse text-center">
            {error}
          </p>
        )}

        {/* === Username === */}
        <div className="m-4 w-full sm:w-[486px]">
          <label
            htmlFor="username"
            className={`block text-[18px] font-bold font-nunito mb-2 ${textColor}`}
          >
            {t("login.username")}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
            rounded-2xl px-4 shadow-md outline-none text-[#134a7b] font-semibold 
            focus:ring-2 focus:ring-[#1C62A0]/50 placeholder:text-[#134a7b]/70 transition-all duration-200"
          />
        </div>

        {/* === Password === */}
        <div className="relative m-2 w-full sm:w-[486px]">
          <label
            htmlFor="password"
            className={`block text-[18px] font-bold font-nunito mb-2 ${textColor}`}
          >
            {t("login.password")}
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
            rounded-2xl px-4 pr-12 shadow-md outline-none text-[#134a7b] font-semibold 
            focus:ring-2 focus:ring-[#1C62A0]/50 placeholder:text-[#134a7b]/70 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute top-[75%] right-4 transform -translate-y-1/2 w-[30px] h-[30px] z-20 cursor-pointer"
          >
            <img
              className="w-[25px] h-[25px] select-none pointer-events-none"
              alt="Toggle password visibility"
              src={showPassword ? eyes2 : eyes}
            />
          </button>
        </div>

        {/* === Password dimenticata === */}
        <div className="w-[63%] flex justify-end">
          <Link
            to="/settings"
            className={`text-[14px] font-bold font-nunito hover:text-[#155293] transition ${textColor}`}
          >
            {t("login.dimenticato")}
          </Link>
        </div>

        {/* === Bottone Login === */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-[225px] h-[50px] mt-8 font-bold font-nunito rounded-2xl shadow-md border border-white/20 
          transition-all duration-500 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          } ${
            theme === "dark"
              ? "bg-white text-[#1C62A0] hover:bg-[#1C62A0] hover:text-white"
              : "bg-[#1C62A0] text-white hover:bg-[#155293]"
          }`}
        >
          {loading ? (
            <span className="animate-pulse text-white font-bold text-[18px] font-nunito">
              {t("login.accessoInCorso")}
            </span>
          ) : (
            <span className="text-[20px] font-bold font-nunito">
              {t("login.bottoneAccedi")}
            </span>
          )}
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
