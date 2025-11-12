import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import bgLight from "../assets/bg/bg3.jpg";
import bgDark from "../assets/bg/bgScuro4.jpg";

import iconLogo from "../assets/logo/logoVuoto.png";
import iconLogo2 from "../assets/logo/iconaLogo.png";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const PublicLayout = () => {
	const { theme } = useTheme();
	const bgImage = theme === "dark" ? bgDark : bgLight;
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<>
			{/* ===== BACKGROUND ===== */}
			<div
				className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10 transition-opacity duration-700"
				style={{ backgroundImage: `url(${bgImage})` }}
			/>

			{/* ===== TOPBAR ===== */}
			<div
				className={`
    fixed top-4 transition-all duration-[500ms] ease-in-out z-30
    ${
			sidebarOpen
				? "left-[10px] w-[calc(100%-125px)]"
				: "left-[-180px] w-[calc(100%-5px)]"
		}
  `}
			>
				<Topbar />
			</div>

			{/* ===== SIDEBAR ===== */}
			{sidebarOpen && (
				<aside
					className={`
            fixed top-0 left-0 h-full z-40 transition-all duration-1200 ease-in-out
            bg-gradient-to-br from-indigo-950 via-indigo-950/90 to-violet-900 
            backdrop-blur-sm border-r border-white/30 shadow-md flex flex-col
            w-[250px] py-2 px-4
          `}
				>
					{/* LOGO */}
					<div
						className="flex flex-col items-center gap-3 cursor-pointer mb-8"
						onClick={() => setSidebarOpen(false)}
					>
						<img
							src={iconLogo}
							alt="Logo"
							className="w-48 h-auto object-contain drop-shadow-md transition-all duration-1200"
						/>
					</div>

					{/* NAVIGATION */}
					<div className="flex-1 w-full transition-all duration-1200 opacity-100">
						<Sidebar />
					</div>
				</aside>
			)}

			{/* ===== LOGO  (visibile quando sidebar chiusa) ===== */}
			{!sidebarOpen && (
				<div
					className="fixed top-6 left-6 z-50 cursor-pointer transition-transform duration-900 hover:scale-105 border border-white/90
        backdrop-blur-sm rounded-full bg-white/10 shadow-md"
					onClick={() => setSidebarOpen(true)}
				>
					<img
						src={iconLogo2}
						alt="Logo"
						className="w-14 h-auto object-contain drop-shadow-lg"
					/>
				</div>
			)}

			{/* ===== CONTENUTO CENTRALE con scrollbar attiva ma invisibile ===== */}
			<section
				className={`transition-all duration-500 ease-in-out 
        ${sidebarOpen ? "ml-[250px]" : "ml-[75px] w-[93%]"}
        mt-[110px] min-h-screen overflow-y-auto p-8 z-10
        ${theme === "dark" ? "text-white" : "text-[#134a7b]"}
      `}
			>
				<Outlet />
			</section>
		</>
	);
};

export default PublicLayout;
