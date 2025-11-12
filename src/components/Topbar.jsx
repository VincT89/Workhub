import userIcon from "../assets/icons/user.png";
import sunIcon from "../assets/icons/sun.png";
import moonIcon from "../assets/icons/do not disturb iOS.png";
import logoutIcon from "../assets/icons/logout.png";
import settingsIcon from "../assets/icons/Settings.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const TopBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className={`
        absolute top-[2%] left-[15%] w-[90%] h-[75px]
        flex items-center justify-between px-8 py-2
        rounded-full shadow-lg border border-white/90
        backdrop-blur-lg transition-colors duration-300 
        ${theme === "dark" ? "bg-white/20 text-white" : "bg-white/10 text-[#134a7b]"}
      `}
    >
      {/* USER SECTION */}
      <div className="flex items-center gap-3">
        <div
          className={`
            flex items-center bg-white/50 dark:bg-white/10
            border border-white/40 rounded-full px-4 py-1 shadow-sm
          `}
        >
          <img src={userIcon} alt="User" className="w-10 h-9" />
        </div>
        <span
          className={`
            font-bold text-lg transition-colors duration-300
            ${theme === "dark" ? "text-white" : "text-[#134a7b]"}
          `}
        >
          {t("topbar.benvenuto")} {user?.role || "Guest"}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleThemeToggle}
          title="Cambia tema"
          className={`
            flex items-center border border-white/90 rounded-full px-2.5 py-2.5
            shadow-sm transition-all duration-300 cursor-pointer
            ${theme === "dark"
              ? "bg-white/30 hover:bg-[#1C62A0]/20"
              : "bg-white/40 hover:bg-white/70"}
          `}
        >
          <img
            src={theme === "dark" ? moonIcon : sunIcon}
            alt={theme === "dark" ? "Dark" : "Light"}
            className="w-5 h-5 mr-1"
          />
        </button>

         <Link
          to="/settings"
          className={`
            flex items-center border border-white/90 rounded-full px-2.5 py-2.5
            shadow-sm transition-all duration-300 cursor-pointer
            ${theme === "dark"
              ? "bg-white/20 hover:bg-[#1C62A0]/20"
              : "bg-white/40 hover:bg-white/70"}
          `}
        >
          <img
            src={settingsIcon}
            alt={theme === "dark" ? "Dark" : "Light"}
            className="w-5 h-5 mr-1"
          />
        </Link>

        <button
          onClick={handleLogout}
          title="Logout"
          className={`
            p-2 rounded-full border border-white/60 shadow-sm transition-all duration-300
            ${theme === "dark"
              ? "bg-white/20 hover:bg-[#1C62A0]/20"
              : "bg-white/40 hover:bg-white/70"}
          `}
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
