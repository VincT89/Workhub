import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { permissions } from "../utils/permission";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const BottomNav = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.ruolo || "user";
  const allowed = permissions[role]?.canView || [];
  const { theme } = useTheme();
  const { t } = useLanguage();

  const routes = [
    { to: "dashboard", label: t("bottomNav.dashboard"), key: "dashboard" },
    { to: "clienti", label: t("bottomNav.clienti"), key: "clienti" },
    { to: "personale", label: t("bottomNav.personale"), key: "personale" },
    { to: "magazzino", label: t("bottomNav.magazzino"), key: "magazzino" },
    { to: "ticket", label: t("bottomNav.ticket"), key: "ticket" },
  ];

  const visibleRoutes = routes.filter((r) => allowed.includes(r.key));

  return (
    <nav
      className={`
        absolute bottom-[6%] left-[10%] w-[80%] h-[60px]
        flex justify-around items-center py-3
        rounded-full shadow-md border border-white/40
        backdrop-blur-sm transition-all duration-300
        ${theme === "dark" ? "bg-white/20 text-white" : "bg-white/30 text-[#134a7b]"}
      `}
    >
      {visibleRoutes.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `
              relative px-6 py-2 font-bold text-lg rounded-full
              transition-all duration-300
              ${isActive
                ? theme === "dark"
                  ? "bg-[#1C62A0] text-white shadow-md scale-105"
                  : "bg-[#1C62A0] text-white shadow-md scale-105"
                : theme === "dark"
                ? "text-white hover:text-[#1C62A0]"
                : "text-[#1C62A0]/80 hover:text-[#1C62A0]"
              }
            `
          }
          end
        >
          {item.label}

          {({ isActive }) =>
            isActive && (
              <span
                className={`
                  absolute inset-0 rounded-full -z-10 blur-lg transition-all duration-300
                  ${theme === "dark" ? "bg-[#1C62A0]/30" : "bg-white/50"}
                `}
              />
            )
          }
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
