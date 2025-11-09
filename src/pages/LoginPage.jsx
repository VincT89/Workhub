import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import bgLight from "../assets/bg/bg.jpg";
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

  useEffect(() => {
    if (token && user) navigate("/dashboard");
  }, [token, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ username, password }));
  };

  const textColor =
    theme === "dark"
      ? "text-[var(--text-dark)]"
      : "text-[var(--color-primary)]";

  return (
    <main className="main-container bg-white dark:bg-black transition-colors duration-500">
      {/* Background */}
      <img
        className="overlay-full z-0 transition-opacity duration-700"
        alt="Background"
        src={backgroundImage}
      />

      {/* Liquid Glass Overlay */}
      <div className="absolute w-[822px] h-[659px] glass-card" />

      {/* Content */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center z-20 w-full max-w-[822px] px-6 py-10"
      >
        {/* Logo + Titolo */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <Link to="/">
            <img className="w-[120px] h-[114px]" alt="Logo" src={iconLogo} />
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

        {/* Errore */}
        {error && <p className="error-text">{error}</p>}

        {/* Username */}
        <div className="m-4 w-full sm:w-[486px]">
          <label htmlFor="username" className={`label-base ${textColor}`}>
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
            className="input-base"
          />
        </div>

        {/* Password */}
        <div className="relative m-2 w-full sm:w-[486px]">
          <label htmlFor="password" className={`label-base ${textColor}`}>
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
            className="input-base pr-12"
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

        {/* Password dimenticata */}
        <div className="w-[63%] flex justify-end">
          <Link
            to="/settings"
            className={`text-link transition-colors duration-500 ${textColor}`}
          >
            {t("login.dimenticato")}
          </Link>
        </div>

        {/* Bottone Login */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-[225px] h-[50px] mt-8 font-bold font-nunito rounded-2xl shadow-md border border-neutral-50/20 transition-colors duration-300
          ${loading ? "opacity-60 cursor-not-allowed" : ""}
          ${
            theme === "dark"
              ? "bg-(--text-dark) text-primary hover:bg-primary hover:text-(--text-dark)"
              : "bg-primary text-(--text-dark) hover:bg-primary-dark"
          }`}
        >
          {loading ? (
            <span className="loading-text text-[18px] font-nunito">
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
