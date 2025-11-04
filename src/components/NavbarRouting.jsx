import React from 'react'
import { NavLink } from 'react-router-dom'

const NavbarRouting = () => {
  return (
    	<nav className="absolute bottom-[6%] left-[10%] w-[80%] h-[60px] bg-[#fafafa30] backdrop-blur-sm border border-white/40 rounded-full flex justify-around items-center py-3 shadow-md transition-all duration-300">
				{[
					{ to: "bacheca", label: "Bacheca" },
					{ to: "clienti", label: "Clienti" },
					{ to: "personale", label: "Personale" },
					{ to: "magazzino", label: "Magazzino" },
					{ to: "ticket", label: "Ticketing" },
				].map((item) => (
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

						{/* Effetto glow dietro la voce attiva */}
						{({ isActive }) =>
							isActive && (
								<span className="absolute inset-0 bg-white/50 blur-lg rounded-full -z-10 transition-all duration-300" />
							)
						}
					</NavLink>
				))}
			</nav>
  )
}

export default NavbarRouting;