import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { permissions } from "../utils/permission";

const BottomNav = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.ruolo || "user";
  const allowed = permissions[role]?.canView || [];

  // Tutte le possibili voci di navigazione
  const routes = [
    { to: "dashboard", label: "Dashboard", key: "dashboard" },
    { to: "clienti", label: "Clienti", key: "clienti" },
    { to: "personale", label: "Personale", key: "personale" },
    { to: "magazzino", label: "Magazzino", key: "magazzino" },
    { to: "ticket", label: "Ticketing", key: "ticket" },
  ];

  // Filtra solo le sezioni che il ruolo può visualizzare
  const visibleRoutes = routes.filter((r) => allowed.includes(r.key));

  return (
    <nav className="bottomnav">
      {visibleRoutes.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative px-6 py-2 font-bold text-lg transition-all duration-300 rounded-full ${
              isActive
                ? "text-white bg-primary shadow-md scale-105"
                : "text-primary/80 hover:text-primary"
            }`
          }
          end
        >
          {item.label}

          {/* Effetto blur dietro la voce attiva */}
          {({ isActive }) =>
            isActive && (
              <span className="absolute inset-0 bg-white/50 blur-lg rounded-full -z-10 transition-all duration-300" />
            )
          }
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
