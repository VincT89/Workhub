import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const Sidebar = () => {

	const { theme } = useTheme();
	const { t } = useLanguage();

 const routes = [
    { to: "dashboard", label: t("sidebar.overview") },
    { to: "clienti", label: t("sidebar.clienti") },
    { to: "personale", label: t("sidebar.personale") },
    { to: "magazzino", label: t("sidebar.magazzino") },
    { to: "ticket", label: t("sidebar.ticket") },
    { to: "ordini", label: t("sidebar.ordini") },
    { to: "resi", label: t("sidebar.resi") },
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
      font-semibold text-[17px] tracking-wide py-3 rounded-xl mx-2
      transition-all duration-300 select-none shadow-sm border
      ${
				isActive
					? // === LINK ATTIVO ===
					  theme === "dark"
						? "bg-violet-700/80 border-violet-500/60 text-white scale-105 shadow-[0_0_18px_rgba(139,92,246,0.7)]"
						: "bg-violet-400/80 border-violet-400/60 text-white scale-105 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
					: // === LINK NON ATTIVO ===
					theme === "dark"
					? "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
					: "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
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
