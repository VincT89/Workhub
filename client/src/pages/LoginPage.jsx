import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import bgLight from "../assets/bg/bg.jpg";
import bgDark from "../assets/bg/bgScuro.jpg";
import iconLogo from "../assets/logo/iconaLogo.png";
import iconLogoDark from "../assets/logo/iconaLogoChiara.png";
import { Eye, EyeSlash } from "@phosphor-icons/react";


const LoginPage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user, token, loading, error } = useSelector((state) => state.auth);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const backgroundImage = theme === "dark" ? bgDark : bgLight;

	// Se già loggato → vai alla dashboard
	useEffect(() => {
		if (token && user) {
			navigate("/board");
		}
	}, [token, user, navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username || !password) return;
		dispatch(loginAsync({ username, password }));
	};

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

	return (
		<main
			className="w-full min-h-screen flex justify-center items-center relative overflow-hidden 
      bg-white dark:bg-black transition-colors duration-500 "
		>
			{/* ===== Background ===== */}
			<img
				className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
				alt="Background"
				src={backgroundImage}
			/>

			{/* ===== Liquid Glass Overlay ===== */}
			<div
				className="absolute w-[822px] h-[659px] lg:w-[60vw] lg:h-[90vh] md:w-[90vw] md:h-[70vh]  
        bg-white/20 dark:bg-white/10 backdrop-blur-sm
        border border-white/30 dark:border-white/90 rounded-[25px] shadow-md
        transition-all duration-700"
			/>

			{/* ===== Form Content ===== */}
			<form
				onSubmit={handleSubmit}
				className="relative flex flex-col items-center z-20 w-full max-w-[822px] px-6 py-10"
			>
				{/* === Logo + Titolo === */}
				<div className="flex items-center justify-center gap-8 mb-8">
					<Link to="/">
						<img
							className="w-[120px] h-[114px] drop-shadow-lg transition-transform duration-300 hover:scale-105"
							alt="Logo"
							src={theme === "dark" ? iconLogoDark : iconLogo}
						/>
					</Link>

					<div className="text-center">
						<span
							className={`text-4xl font-bold font-nunito uppercase transition-colors duration-500 ${textColor}`}
						>
							{t("login.titolo")}
						</span>
						<br />
						<span
							className={`font-bold font-nunito text-sm transition-colors duration-500 ${textColor}`}
						>
							{t("login.credenzialiDemo")}
						</span>
					</div>
				</div>

				{/* === Messaggio di errore === */}
				{error && (
					<p className="text-[#DC2626] font-bold mt-3 mb-2 animate-pulse text-center">
						{error}
					</p>
				)}

				{/* === Username === */}
				<div className="m-4 w-full sm:w-[486px]">
					<label
						htmlFor="username"
						className={`block text-[18px] font-bold font-nunito mb-2 ${textColor}`}
					>
						{t("login.username")}
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autoComplete="username"
						required
						className="custom-input w-full"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				{/* === Password === */}
				<div className="relative m-2 w-full sm:w-[486px]">
					<label
						htmlFor="password"
						className={`block text-[18px] font-bold font-nunito mb-2 ${textColor}`}
					>
						{t("login.password")}
					</label>
					<input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						required
						className="custom-input w-full"
						value={password}
						onChange={(e) => setPassword(e.target.value)}

					/>
					<button
						type="button"
						onClick={() => setShowPassword((s) => !s)}
						className="absolute top-[75%] right-4 transform -translate-y-1/2 w-[30px] h-[30px] z-20 cursor-pointer flex items-center justify-center"
					>
						{showPassword ? (
							<Eye
								size={24}
								color={theme === "dark" ? "#fff" : "#090c64"}
								weight="duotone"
							/>
						) : (
							<EyeSlash
								size={24}
								color={theme === "dark" ? "#fff" : "#090c64"}
								weight="duotone"
							/>
						)}
					</button>
				</div>

				{/* === Password dimenticata === */}
				<div className="w-[63%] flex justify-end">
					<Link
						to="/forgot-password"
						className={`text-[14px] font-bold font-nunito transition ${textColor}`}
					>
						{t("login.dimenticato")}
					</Link>
				</div>

				{/* === Bottone Login === */}
				<button
					type="submit"
					disabled={loading}
					className={`btn-login ${loading ? "btn-login-disabled" : ""}`}
				>
					{loading ? (
						<span className="animate-pulse font-bold text-[18px] font-nunito">
							{t("login.accessoInCorso")}
						</span>
					) : (
						<span className="text-[20px] font-bold font-nunito">
							{t("login.bottoneAccedi")}
						</span>
					)}
				</button>
			</form>
		</main>
	);
};

export default LoginPage;
