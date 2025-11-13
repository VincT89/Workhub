import userIcon from "../assets/icons/user.png";
import { User, Sun, Moon, Gear, SignOut } from "@phosphor-icons/react";
import sunIcon from "../assets/icons/sun.png";
import moonIcon from "../assets/icons/do not disturb iOS.png";
import logoutIcon from "../assets/icons/logout.png";
import settingsIcon from "../assets/icons/Settings.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/feature/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const TopBar = () => {
	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();
	const { t } = useLanguage();

	const handleThemeToggle = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<header
			className={`
        absolute top-[2%] left-[15%] w-[90%] h-[75px] 
        flex items-center justify-between px-8 py-2
        rounded-full shadow-white-lg border border-white/90
        backdrop-blur-lg  transition-colors duration-300
        ${
					theme === "dark"
						? "bg-white/10 text-white"
						: "bg-white/10 text-[#080ebf]"
				}
      `}> 
		
			<div className="flex items-center gap-3">
				<div>
					<User
						size={30}
						color={theme === "dark" ? "white" : "#080ebf"}
						weight="duotone" cursor="pointer"
					/>
				</div>
				<span
					className={`
          font-bold text-lg transition-colors duration-300
          ${theme === "dark" ? "text-white" : "text-[#080ebf]"}
            `}
				>
					{t("topbar.benvenuto")} {user?.role || "Guest"}
				</span>
			</div>

			{/* ACTIONS */}
			<div className="flex items-center gap-9">
				<button
					onClick={handleThemeToggle}
				>
					{theme === "dark" ? (
						<Moon size={30} color="white" weight="duotone" cursor="pointer" />
					) : (
						<Sun size={30} color="#080ebf" weight="duotone" cursor="pointer" />
					)}
				</button>

				<Link
					to="/settings">
					<Gear
						size={30}
						color={theme === "dark" ? "white" : "#080ebf"}
						weight="duotone"
					/>
				</Link>

				<button
					onClick={handleLogout}
					title="Logout"
				>
					<SignOut
						size={30}
						color={theme === "dark" ? "white" : "#080ebf"}
						weight="duotone" cursor="pointer"
					/>
				</button>
			</div>
		</header>
	);
};

export default TopBar;
