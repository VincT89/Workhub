import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { permissions } from "../utils/permission";

const BottomNav = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.ruolo || "user"; 
  const allowed = permissions[role]?.canView || []; // Ottieni le sezioni che il ruolo può visualizzare - canView e' un array definito in permission.js

  // Tutte le possibili voci di navigazione per poterle filtrare in base ai permessi
  const routes = [
    { to: "dashboard", label: "Dashboard", key: "dashboard" },
    { to: "clienti", label: "Clienti", key: "clienti" },
    { to: "personale", label: "Personale", key: "personale" },
    { to: "magazzino", label: "Magazzino", key: "magazzino" },
    { to: "ticket", label: "Ticketing", key: "ticket" },
  ];

  // Filtra solo le sezioni che il ruolo può visualizzare, basato sui permessi che prendono dal file permission.js
  const visibleRoutes = routes.filter((r) => allowed.includes(r.key));

  return (
    <nav className="absolute bottom-[6%] left-[10%] w-[80%] h-[60px] bg-[#fafafa30] backdrop-blur-sm border border-white/40 rounded-full flex justify-around items-center py-3 shadow-md transition-all duration-300">
      {visibleRoutes.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative px-6 py-2 font-bold text-lg transition-all duration-300 rounded-full ${
              isActive
                ? "text-[#1C62A0] bg-white shadow-md scale-105"
                : "text-[#1C62A0]/80 hover:text-[#1C62A0]"
            }`
          }
          end
        >
          {item.label}

          {/* Effetto sfocato dietro la voce attiva */}
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
