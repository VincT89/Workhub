import searchIcon from "../assets/icons/search.png";
import userIcon from "../assets/icons/user.png";
import sunIcon from "../assets/icons/sun.png";
import moonIcon from "../assets/icons/do not disturb iOS.png";
import logoutIcon from "../assets/icons/logout.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";

const TopBar = () => {
	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();

	const handleThemeToggle = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<header className="topbar transition-colors duration-300">
			{/* Benvenuto */}
			<div className="flex items-center gap-3">
				<div className="flex items-center bg-white/50 dark:bg-glass border border-white/40 rounded-full px-4 py-1 shadow-sm">
					<img src={userIcon} alt="User" className="w-10 h-9" />
				</div>
				<span
					className={`font-bold text-lg transition-colors duration-300 ${
						theme === "dark"
							? "text-(--text-dark)"
							: "text-(--text-primary)"
					}`}
				>
					Benvenuto, {user?.role || "Guest"}
				</span>
			</div>

			{/* Barra di ricerca */}
			<div className="flex items-center bg-white/70 dark:bg-glass rounded-full border border-white/60 px-3 py-1 w-[40%] shadow-sm transition-colors duration-300">
				<Link to="/" className="cursor-pointer">
					<img src={searchIcon} alt="Cerca" className="w-7 h-5 mr-2" />
				</Link>
				<input
					type="text"
					placeholder="Cerca..."
					className={`bg-transparent outline-none font-semibold w-full transition-colors duration-300 ${
						theme === "dark"
							? "text-white placeholder-white/70"
							: "text-blue-900 placeholder-primary"
					}`}
				/>
			</div>

			{/* Light/Dark mode + Logout */}
			<div className="flex items-center gap-4">
				<button
					onClick={handleThemeToggle}
					className="flex items-center bg-white/50 dark:bg-glass border border-white/40 rounded-full px-4 py-1 shadow-sm cursor-pointer hover:bg-white/70 dark:hover:bg-primary/20 transition-all duration-300"
					title="Cambia tema"
				>
					<img
						src={theme === "dark" ? moonIcon : sunIcon}
						alt={theme === "dark" ? "Dark" : "Light"}
						className="w-5 h-5 mr-1"
					/>
					<span
						className={`font-bold text-sm ${
							theme === "dark"
								? "text-(--text-dark)"
								: "text-primary"
						}`}
					>
						{theme === "dark" ? "Dark" : "Light"}
					</span>
				</button>

				<button
					onClick={handleLogout}
					className="bg-white/40 dark:bg-glass p-2 rounded-full border border-white/60 hover:bg-white/70 dark:hover:bg-primary/20 transition-all duration-300"
					title="Logout"
				>
					<img src={logoutIcon} alt="Logout" className="w-6 h-6" />
				</button>
			</div>
		</header>
	);
};

export default TopBar;
