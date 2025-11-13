import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { personnel } from "../api/mock/personaleMock";

import bgLight from "../assets/bg/bg3.jpg";
import bgDark from "../assets/bg/bgScuro3.jpg";
import { Sun, Moon } from "@phosphor-icons/react";
import darkIcon from "../assets/icons/Do not Disturb iOS.png";
import lightIcon from "../assets/icons/Sun.png";

const PasswordRecoveryPage = () => {
	const { theme, setTheme } = useTheme();
	const { t } = useLanguage();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("");

	const backgroundImage = theme === "dark" ? bgDark : bgLight;

	const handleRecovery = (e) => {
		e.preventDefault();

		if (!email && !username) {
			setMessage("Inserisci username o email per recuperare la password.");
			setMessageType("error");
			return;
		}

		// Simulazione ricerca utente (mock)
		const users = JSON.parse(localStorage.getItem("users")) || [...personnel];
		const userFound = users.find(
			(u) =>
				u.email?.toLowerCase() === email.toLowerCase() ||
				u.username?.toLowerCase() === username.toLowerCase()
		);

		if (!userFound) {
			setMessage("Nessun account trovato con i dati forniti.");
			setMessageType("error");
			return;
		}

		// Simula invio email di recupero (fittizio)
		setTimeout(() => {
			setMessage(
				`Email di recupero inviata a ${userFound.email}. Segui le istruzioni per reimpostare la password.`
			);
			setMessageType("success");
		}, 1000);
	};

	const textColor = theme === "dark" ? "text-white" : "text-[#080ebf]";
	const labelColor = theme === "dark" ? "text-white" : "text-[#080ebf]";

	return (
		<main
			className="w-full min-h-screen flex justify-center items-center relative overflow-hidden 
      transition-colors duration-500"
		>
			{/* ===== Background ===== */}
			<img
				className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
				alt="Background"
				src={backgroundImage}
			/>
			<div className="relative z-20 w-full sm:w-[480px] flex flex-col items-center px-6 py-10 space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between w-full mb-6">
					<h1
						className={`text-3xl font-bold uppercase transition-colors duration-500 ${textColor}`}
					>
						Recupera Password
					</h1>

					{/* Tema toggle */}
					<button
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className="p-2 rounded-xl border border-white/30 hover:bg-[#1C62A0]/10 transition-colors duration-300"
					>
						{theme === "dark" ? (
							<Moon size={30} color="white" weight="duotone" cursor="pointer" />
						) : (
							<Sun
								size={30}
								color="#080ebf"
								weight="duotone"
								cursor="pointer"
							/>
						)}
					</button>
				</div>

				{/* Card contenitore */}
				<section
					className="w-full p-6 rounded-[25px] shadow-md border border-white/90 
          bg-white/10 dark:bg-white/10 backdrop-blur-sm transition-all duration-500"
				>
					<h2
						className={`${textColor} text-xl font-bold mb-4 border-b ${theme === "dark" ? "border-white" : "border-[#080ebf]"} pb-2`}
					>
						Inserisci i tuoi dati
					</h2>

					{message && (
						<p
							className={`${
								messageType === "success" ? "text-green-500" : "text-red-500"
							} text-center font-bold mb-4 transition-opacity duration-500`}
						>
							{message}
						</p>
					)}

					<form
						onSubmit={handleRecovery}
						className="flex flex-col gap-5 text-[#134a7b]"
					>
						{/* Username */}
						<div>
							<label
								className={`block text-[18px] font-bold font-nunito mb-2 ${labelColor}`}
							>
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Inserisci il tuo username"
								className={`w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
            rounded-2xl px-4 shadow-md outline-none
            ${
							theme === "dark"
								? "text-white placeholder:text-white focus:ring-white"
								: "text-[#080ebf] focus:ring-[#080ebf] placeholder:text-[#080ebf]/70 "
						} font-semibold 
            focus:ring-2  transition-all duration-200
            }`}
							/>
						</div>

						{/* Email */}
						<div>
							<label
								className={`block text-[18px] font-bold font-nunito mb-2 ${labelColor}`}
							>
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Inserisci la tua email"
								className={`w-full h-[35px] bg-[rgba(217,217,217,0.3)] border border-white/30 
            rounded-2xl px-4 shadow-md outline-none
            ${
							theme === "dark"
								? "text-white placeholder:text-white focus:ring-white"
								: "text-[#080ebf] focus:ring-[#080ebf] placeholder:text-[#080ebf]/70 "
						} font-semibold 
            focus:ring-2  transition-all duration-200
            }`}
							/>
						</div>

						{/* Pulsante Recupera */}
						<button
							type="submit"
							className="w-full mt-4 py-3 font-bold rounded-2xl shadow-md border border-white/20 
              bg-[#080ebf] text-white cursor-pointer hover:scale-102 hover:border-white/90 hover:shadow-lg transition-colors duration-300"
						>
							Invia richiesta
						</button>

						{/* Link di ritorno */}
						<Link
							to="/login"
							className={`text-center mt-3 ${theme === "dark" ? "text-white" : "text-[#080ebf]"} font-semibold hover:underline transition-all duration-200`}
						>
							Torna al Login
						</Link>
					</form>
				</section>
			</div>
		</main>
	);
};

export default PasswordRecoveryPage;
