import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const role = useSelector((state) => state.auth.user?.role);
  const isUser = role === "user";
  const location = useLocation();

  const routes = [
    { to: "board", label: t("overview") },
    { to: "customers", label: t("clienti") },
    {
      to: isUser ? "personale" : "personale",
      label: isUser ? t("profilo") : t("personale"),
    },
    { to: "warehouse", label: t("magazzino") },
    { to: "ticket", label: t("ticket") },
    { to: "orders", label: t("ordiniSidebar") },
  ];

  // funzione che decide se il link è attivo
  const isRouteActive = (itemTo) => {
    const path = location.pathname;

    if (itemTo === "customers") {
      return path.startsWith("/customers") || path.startsWith("/customer");
    }

    if (itemTo === "personale") {
      return path.startsWith("/personale");
    }

    if (itemTo === "warehouse") {
      // warehouse attivo sia su /warehouse che su /product/:id
      return path.startsWith("/warehouse") || path.startsWith("/product");
    }

    // per gli altri (board, ticket, orders) match esatto
    return path === `/${itemTo}`;
  };

  return (
    <nav
      className={`flex flex-col gap-14 items-stretch w-full h-full 
        px-3 py-4 transition-all duration-300 mt-20`}
    >
      {routes.map((item) => {
        const active = isRouteActive(item.to);

        return (
          <NavLink
            key={item.to}
            to={`/${item.to}`} // percorso assoluto
            className={`
              relative flex items-center justify-center text-center font-bold text-[16px] 
              tracking-wide py-1 rounded-xl mx-2 select-none
              ${
                active
                  ? theme === "dark"
                    ? "border-violet-500/60 border-2 text-white scale-105"
                    : "border-violet-500/60 border-2 bg-white scale-105 text-[#090c64]"
                  : theme === "dark"
                  ? "bg-violet/60  text-[white]/80 hover:bg-violet/40 "
                  : "text-white hover:border-2 hover:border-violet-400/20"
              }
            `}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Sidebar;
