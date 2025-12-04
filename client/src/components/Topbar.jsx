import { UserIcon, SunIcon, MoonIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react";
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
        w-full h-[60px]
        flex items-center justify-between
        px-6 md:px-8 py-2
        rounded-xl border border-white/90 shadow-white
        backdrop-blur-lg transition-colors duration-300
        ${theme === "dark" ? "bg-white/10 text-white" : "bg-white/10 text-[#090c64]"}
      `}
    >
      {/* LATO SINISTRO: icona utente + testo */}
      <div className="flex items-center gap-3">
        <UserIcon
          size={28}
          color={theme === "dark" ? "white" : "#090c64"}
          weight="duotone"
          cursor="pointer"
        />
        <span
          className={`
            font-bold text-base md:text-lg transition-colors duration-300
            ${theme === "dark" ? "text-white" : "text-[#090c64]"}
          `}
        >
          {t("dashboard.benvenuto")} {user?.firstName || "Guest"}
        </span>
      </div>

      {/* LATO DESTRO: azioni */}
      <div className="flex items-center gap-6 md:gap-9">
        <button onClick={handleThemeToggle}>
          {theme === "dark" ? (
            <MoonIcon size={26} color="white" weight="duotone" cursor="pointer" />
          ) : (
            <SunIcon size={26} color="#090c64" weight="duotone" cursor="pointer" />
          )}
        </button>

        <Link to="/settings">
          <GearIcon
            size={26}
            color={theme === "dark" ? "white" : "#090c64"}
            weight="duotone"
          />
        </Link>

        <button onClick={handleLogout} title="Logout">
          <SignOutIcon
            size={26}
            color={theme === "dark" ? "white" : "#090c64"}
            weight="duotone"
            cursor="pointer"
          />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
