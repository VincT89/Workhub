import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { permissions } from "../utils/permission";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const BottomNav = () => {
  const user = useSelector((state) => state.auth.user); // Ottieni l'utente dallo stato Redux
  const role = user?.ruolo || "user"; // se l'utente non è definito, usa "user" come ruolo predefinito
  const allowed = permissions[role]?.canView || []; // Ottieni le rotte consentite in base al ruolo in permissions.js
  const { theme } = useTheme(); // Prende il tema corrente dal context 
  const { t } = useLanguage(); // Prende la funzione di traduzione dal context

  const routes = [
    { to: "dashboard", label: t("bottomNav.dashboard"), key: "dashboard" },
    { to: "clienti", label: t("bottomNav.clienti"), key: "clienti" },
    { to: "personale", label: t("bottomNav.personale"), key: "personale" },
    { to: "magazzino", label: t("bottomNav.magazzino"), key: "magazzino" },
    { to: "ticket", label: t("bottomNav.ticket"), key: "ticket" },
  ];

  const visibleRoutes = routes.filter((r) => allowed.includes(r.key)); // Filtra le rotte in base ai permessi

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
