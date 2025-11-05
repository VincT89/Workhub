import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg/bg.jpg";


import iconlogo from "../assets/logo/iconaLogo.png";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";

const PublicLayout = () => {
	return (
		<main className="relative w-full min-h-screen overflow-hidden bg-white">
			{/* Background */}
			<img
				src={bgImage}
				alt="Background"
				className="absolute top-0 left-0 w-full h-full object-cover"
			/>

			{/* Liquid Glass Overlay principale */}
			<div className="absolute top-[3%] left-[3%] w-[94%] h-[94%] bg-[#fafafa20] backdrop-blur-md rounded-[25px] border border-white/30 shadow-lg" />

			{/* LOGO in alto a sinistra */}
			<div className="absolute top-[6.5%] left-[5%] flex justify-center items-center">
				<div className="flex items-center bg-white/50 border border-white/40 rounded-full px-1 py-1 shadow-sm">
					<img
						src={iconlogo}
						alt="Logo"
						className="w-14 h-14 object-contain drop-shadow-md"
					/>
				</div>
			</div>

			{/* Navbar superiore - COMPONENTI */}
			<Topbar />
			{/* Sidebar sinistra centrata - COMPONENTI */}
			<Sidebar />

			{/* Contenuto dinamico con effetto Liquid Glass */}
			<section className="absolute top-[16%] left-[10%] w-[80%] h-[70%] bg-[#fafafa20] backdrop-blur-sm rounded-[25px] border border-white/30 shadow-md p-6 overflow-auto ">
				<Outlet />
			</section>

			{/* BottomNav */}
			<BottomNav />
		</main>
	);
};

export default PublicLayout;
