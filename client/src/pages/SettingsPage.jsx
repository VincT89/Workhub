import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {updateUserAsync} from "../store/feature/userSlice";
import {changePasswordAsync} from "../store/feature/authSlice";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import italianFlag from "../assets/icons/Italy.png";
import englishFlag from "../assets/icons/Great Britain.png";

import { Eye, EyeSlash, Sun, Moon } from "@phosphor-icons/react";

const SettingsPage = () => {
	const { theme, setTheme } = useTheme();
	const { lang, toggleLang, t } = useLanguage();
	const dispatch = useDispatch();
	const { user, token } = useSelector((state) => state.auth);

	// DATI UTENTE
	const [username, setUsername] = useState(user?.username || "");
	const [name, setName] = useState(
		(user?.firstName || "") + " " + (user?.lastName || "")
	);

	const [email] = useState(user?.email || ""); // <-- email bloccata
	const [role] = useState(user?.role || ""); // <-- ruolo bloccato

	// CAMBIO PASSWORD
	const [oldPassword, setOldPassword] = useState("");
	const [showOldPassword, setShowOldPassword] = useState(false);

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// EDIT MODE
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingAccount, setIsEditingAccount] = useState(false);

	// MESSAGGI
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("");

	// SALVATAGGIO MODIFICHE
	const handleSave = async (e) => {
		e.preventDefault();
		setMessage("");

		if (!email) {
			setMessage("Email non valida nel profilo utente.");
			setMessageType("error");
			return;
		}

		// Nome completo diviso
		const [firstName, lastName] = name.trim().split(" ");

		// ID sicuro: supporta sia _id che id
		const userId = user?._id || user?.id;

		if (!userId) {
			setMessage("ID utente non valido. Effettua di nuovo il login.");
			setMessageType("error");
			return;
		}

		console.log("UPDATE USER REQUEST:", {
			userFromState: user,
			userId,
		});

		try {
			await dispatch(
				updateUserAsync({
					id: userId,
					token,
					updates: {
						username,
						firstName: firstName || "",
						lastName: lastName || "",
						email,
					},
				})
			).unwrap();
		} catch (err) {
			setMessage(err);
			setMessageType("error");
			return;
		}

		//CAMBIO PASSWORD
		if (newPassword || confirmPassword || oldPassword) {
			if (!oldPassword) {
				setMessage(t("settings.inserisciPasswordAttuale"));
				setMessageType("error");
				return;
			}

			if (!newPassword || !confirmPassword) {
				setMessage("Inserisci la nuova password e conferma.");
				setMessageType("error");
				return;
			}

			if (newPassword !== confirmPassword) {
				setMessage(t("settings.passwordNonCoincidono"));
				setMessageType("error");
				return;
			}

			try {
				await dispatch(
					changePasswordAsync({
						email,
						oldPassword,
						newPassword,
						token,
					})
				).unwrap();
			} catch (err) {
				setMessage(err);
				setMessageType("error");
				return;
			}
		}

		// SUCCESS
		setMessage(t("settings.modificheSalvate"));
		setMessageType("success");

		// RESET
		setOldPassword("");
		setNewPassword("");
		setConfirmPassword("");

		setIsEditing(false);
		setIsEditingAccount(false);

		setTimeout(() => {
			setMessage("");
			setMessageType("");
		}, 3000);
	};

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";
	const labelColor = textColor;
	const inputDisabledStyle =
		"cursor-not-allowed bg-gray-200/50 dark:bg-gray-600/20";

	return (
		<main className="w-full min-h-screen flex justify-center items-center relative overflow-hidden transition-colors duration-500">
			<div className="relative z-20 w-full flex flex-col items-center px-6 py-8 space-y-10">
				{/*        HEADER            */}
				<div className="flex items-center gap-2">
					<h1 className={`text-3xl font-bold uppercase ${textColor}`}>
						{t("settings.impostazioni")}
					</h1>
				</div>

				{/*   SEZIONE 1 — ANAGRAFICA     */}

				<section className="w-full p-6 rounded-[25px] shadow-md border border-white/30 bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm">
					<div className="flex justify-between items-center mb-4 border-b border-[#090c64] pb-2">
						<h2 className={`${textColor} text-xl font-bold`}>
							{t("settings.anagraficaUtente")}
						</h2>

						<button
							type="button"
							onClick={() => setIsEditing((prev) => !prev)}
							className="px-4 py-1 rounded-xl text-sm font-semibold border border-white text-white bg-[#090c64] hover:bg-[#090c64]/80"
						>
							{isEditing ? t("settings.annulla") : t("settings.modifica")}
						</button>
					</div>

					{message && (
						<p
							className={`${
								messageType === "success" ? "text-[#090c64]/80" : "text-red-500"
							} text-center font-bold mb-4`}
						>
							{message}
						</p>
					)}

					<form className="flex flex-col gap-4">
						{/* Username */}
						<div>
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.username")}
							</label>
							<input
								type="text"
								value={username}
								disabled={!isEditing}
								onChange={(e) => setUsername(e.target.value)}
								className={`w-full h-[35px] border rounded-2xl px-4 shadow-md bg-[rgba(217,217,217,0.3)]
                ${!isEditing ? inputDisabledStyle : ""}`}
							/>
						</div>

						{/* Nome completo */}
						<div>
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.nomeCompleto")}
							</label>
							<input
								type="text"
								value={name}
								disabled={!isEditing}
								onChange={(e) => setName(e.target.value)}
								className={`w-full h-[35px] border rounded-2xl px-4 shadow-md bg-[rgba(217,217,217,0.3)]
                ${!isEditing ? inputDisabledStyle : ""}`}
							/>
						</div>

						{/* Email (non modificabile) */}
						<div>
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.email")}
							</label>
							<input
								type="email"
								value={email}
								disabled={true}
								className="w-full h-[35px] border rounded-2xl px-4 shadow-md bg-gray-300/50 dark:bg-gray-600/30 cursor-not-allowed"
							/>
						</div>

						{/* Ruolo (non modificabile) */}
						<div>
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.ruolo")}
							</label>
							<input
								type="text"
								value={role}
								disabled={true}
								className="w-full h-[35px] border rounded-2xl px-4 shadow-md bg-gray-300/50 dark:bg-gray-600/30 cursor-not-allowed"
							/>
						</div>
					</form>
				</section>

				{/*   SEZIONE 2 — ACCOUNT        */}
				<section className="w-full p-6 rounded-[25px] shadow-md border border-white/30 bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm">
					<div className="flex justify-between items-center mb-4 border-b border-[#090c64] pb-2">
						<h2 className={`${textColor} text-xl font-bold`}>
							{t("settings.account")}
						</h2>

						<button
							type="button"
							onClick={() => setIsEditingAccount((prev) => !prev)}
							className="px-4 py-1 rounded-xl text-sm font-semibold border border-white text-white bg-[#090c64] hover:bg-[#090c64]/80"
						>
							{isEditingAccount
								? t("settings.annulla")
								: t("settings.modifica")}
						</button>
					</div>

					<form onSubmit={handleSave} className="flex flex-col gap-4">
						{/* PASSWORD ATTUALE */}
						<div className="relative">
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.passwordAttuale")}
							</label>

							<input
								type={showOldPassword ? "text" : "password"}
								value={oldPassword}
								disabled={!isEditingAccount}
								onChange={(e) => setOldPassword(e.target.value)}
								className={`w-full h-[35px] border rounded-2xl px-4 pr-12 shadow-md
                bg-[rgba(217,217,217,0.3)]
                ${!isEditingAccount ? inputDisabledStyle : ""}`}
							/>

							<button
								type="button"
								onClick={() => setShowOldPassword((s) => !s)}
								disabled={!isEditingAccount}
								className="absolute top-[70%] right-4 transform -translate-y-1/2"
							>
								{showOldPassword ? (
									<Eye
										size={24}
										color={theme === "dark" ? "#fff" : "#090c64"}
									/>
								) : (
									<EyeSlash
										size={24}
										color={theme === "dark" ? "#fff" : "#090c64"}
									/>
								)}
							</button>
						</div>

						{/* NUOVA PASSWORD */}
						<div className="relative">
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.nuovaPassword")}
							</label>

							<input
								type={showNewPassword ? "text" : "password"}
								value={newPassword}
								disabled={!isEditingAccount}
								onChange={(e) => setNewPassword(e.target.value)}
								className={`w-full h-[35px] border rounded-2xl px-4 pr-12 shadow-md
                bg-[rgba(217,217,217,0.3)]
                ${!isEditingAccount ? inputDisabledStyle : ""}`}
							/>

							<button
								type="button"
								onClick={() => setShowNewPassword((s) => !s)}
								disabled={!isEditingAccount}
								className="absolute top-[70%] right-4 transform -translate-y-1/2"
							>
								{showNewPassword ? (
									<Eye
										size={24}
										color={theme === "dark" ? "#fff" : "#090c64"}
									/>
								) : (
									<EyeSlash
										size={24}
										color={theme === "dark" ? "#fff" : "#090c64"}
									/>
								)}
							</button>
						</div>

						{/* CONFERMA PASSWORD */}
						<div className="relative">
							<label className={`${labelColor} text-[18px] font-bold mb-2`}>
								{t("settings.confermaPassword")}
							</label>

							<input
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								disabled={!isEditingAccount}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className={`w-full h-[35px] border rounded-2xl px-4 pr-12 shadow-md
                bg-[rgba(217,217,217,0.3)]
                ${!isEditingAccount ? inputDisabledStyle : ""}`}
							/>

							<button
								type="button"
								onClick={() => setShowConfirmPassword((s) => !s)}
								disabled={!isEditingAccount}
								className="absolute top-[70%] right-4 transform -translate-y-1/2"
							>
								{showConfirmPassword ? (
									<Eye
										size={24}
										color={theme === "dark" ? "#fff" : "#090c64"}
									/>
								) : (
									<EyeSlash
										size={24}
										color={theme === "dark" ? "#fff" : "#090c64"}
									/>
								)}
							</button>
						</div>
					</form>
				</section>

				{/*    SEZIONE 3 — ASPETTO       */}
				<section className="w-full p-6 rounded-[25px] shadow-md border border-white/30 bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm">
					<h2
						className={`${textColor} text-xl font-bold mb-4 border-b border-[#090c64] pb-2`}
					>
						{t("settings.aspetto")}
					</h2>

					<div className="flex flex-col sm:flex-row justify-between gap-4">
						{/* Tema */}
						<div className="flex flex-col gap-2 w-full sm:w-1/2">
							<span className={`${labelColor} font-semibold mb-1`}>
								{t("settings.tema")}
							</span>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setTheme("light")}
									className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-[#090c64] duration-300 ${
										theme === "light"
											? "border-[#090c64] bg-[rgba(217,217,217,0.3)]"
											: "border-gray-300 dark:border-white/30"
									}`}
								>
									<Sun size={28} color="#090c64" weight="duotone" /> Light
								</button>

								<button
									type="button"
									onClick={() => setTheme("dark")}
									className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-[#090c64] duration-300 ${
										theme === "dark"
											? "border-[#090c64] bg-[rgba(217,217,217,0.3)]"
											: "border-gray-300 dark:border-white/30"
									}`}
								>
									<Moon size={28} color="#090c64" weight="duotone" /> Dark
								</button>
							</div>
						</div>

						{/* Lingua */}
						<div className="flex flex-col gap-2 w-full sm:w-1/2">
							<span className={`${labelColor} font-semibold mb-1`}>
								{t("settings.lingua")}
							</span>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => toggleLang("it")}
									className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[#090c64] transition-colors duration-300 ${
										lang === "it"
											? "border-[#090c64] bg-[rgba(217,217,217,0.3)]"
											: "border-gray-300 dark:border-white/30"
									}`}
								>
									<img src={italianFlag} alt="Italiano" className="w-6 h-6" />
									{t("settings.italiano")}
								</button>

								<button
									type="button"
									onClick={() => toggleLang("en")}
									className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[#090c64] transition-colors duration-300 ${
										lang === "en"
											? "border-[#090c64] bg-[rgba(217,217,217,0.3)]"
											: "border-gray-300 dark:border-white/30"
									}`}
								>
									<img src={englishFlag} alt="Inglese" className="w-6 h-6" />
									{t("settings.inglese")}
								</button>
							</div>
						</div>
					</div>
				</section>

				{/*     SEZIONE 4 — BOTTONI      */}
				<section className="w-full flex flex-col sm:flex-row justify-center gap-6 mt-2">
					<button
						type="submit"
						onClick={handleSave}
						className="w-full sm:w-[200px] py-3 font-bold rounded-2xl shadow-md border bg-[#090c64] text-white hover:bg-[#090c64]/80"
					>
						{t("settings.salvaModifiche")}
					</button>

					<Link
						to="/login"
						className="w-full sm:w-[200px] py-3 text-center font-bold rounded-2xl shadow-md border bg-[#090c64] text-white hover:bg-[#090c64]/80"
					>
						{t("settings.esci")}
					</Link>
				</section>
			</div>
		</main>
	);
};

export default SettingsPage;
