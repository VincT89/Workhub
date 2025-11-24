import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useSelector } from "react-redux";

const Sidebar = () => {

	const { theme } = useTheme();
	const { t } = useLanguage();
	const role = useSelector((state) => state.auth.user?.role);
	const isUser = role === "user";

  const routes = [
    { to: "board", label: t("sidebar.overview") },
    { to: "customers", label: t("sidebar.clienti") },

   
    {
      to: isUser ? "personale" : "personale",
      label: isUser ? t("sidebar.profilo") : t("sidebar.personale"),
    },

    { to: "warehouse", label: t("sidebar.magazzino") },
    { to: "ticket", label: t("sidebar.ticket") },
    { to: "orders", label: t("sidebar.ordini") },
  
  ];

	return (
		<nav
			className={`flex flex-col justify-evenly items-stretch w-full h-full 
        px-3 py-4 transition-all duration-300`}
		>
			{routes.map((item) => (
				<NavLink
					key={item.to}
					to={item.to}
					end
					className={({ isActive }) =>
						`
      relative flex items-center justify-center text-center
      font-semibold text-[16px] tracking-wide py-1 rounded-xl mx-2
      transition-all duration-300 select-none shadow-sm border
      ${
				isActive
					? // === LINK ATTIVO ===
					  theme === "dark"
						? " border-violet-500/60 border-2 text-white scale-105 shadow-[0_0_18px_rgba(139,92,246,0.7)]"
						: "border-violet-500/60 border-2 text-white scale-105 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
					: // === LINK NON ATTIVO ===
					theme === "dark"
					? "bg-violet/60 border-white/20 text-[#080ebf]/80 hover:bg-violet/40 hover:border-white/30 "
					: "text-white/80 border-none"
			}
    `
					}
				>
					{item.label}
				</NavLink>
			))}
		</nav>
	);
};

export default Sidebar;
