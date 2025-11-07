import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { permissions } from "../utils/permission";
import { useTheme } from "../context/ThemeContext";

const BottomNav = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.ruolo || "user";
  const allowed = permissions[role]?.canView || [];
  const { theme } = useTheme();

  const routes = [
    { to: "dashboard", label: "Dashboard", key: "dashboard" },
    { to: "clienti", label: "Clienti", key: "clienti" },
    { to: "personale", label: "Personale", key: "personale" },
    { to: "magazzino", label: "Magazzino", key: "magazzino" },
    { to: "ticket", label: "Ticketing", key: "ticket" },
  ];

  const visibleRoutes = routes.filter((r) => allowed.includes(r.key));

  return (
    <nav className="bottomnav transition-colors duration-300">
      {visibleRoutes.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative px-6 py-2 font-bold text-lg rounded-full transition-all duration-300 ${
              isActive
                ? `${
                    theme === "dark"
                      ? "text-(--text-dark) bg-primary"
                      : "text-white bg-primary"
                  } shadow-md scale-105`
                : `${
                    theme === "dark"
                      ? "text-(--text-dark) hover:text-primary"
                      : "text-primary/80 hover:text-primary"
                  }`
            }`
          }
          end
        >
          {item.label}

          {/* Effetto blur dietro la voce attiva */}
          {({ isActive }) =>
            isActive && (
              <span
                className={`absolute inset-0 rounded-full -z-10 blur-lg transition-all duration-300 ${
                  theme === "dark" ? "bg-primary/30" : "bg-white/50"
                }`}
              />
            )
          }
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
