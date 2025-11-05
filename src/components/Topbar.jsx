import searchIcon from '../assets/icons/search.png';
import userIcon from '../assets/icons/user.png';
import sunIcon from '../assets/icons/sun.png';
import moonIcon from '../assets/icons/do not disturb iOS.png';
import logoutIcon from '../assets/icons/logout.png';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../store/feature/authSlice';



const TopBar = () => {

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  	const navigate = useNavigate();

	const handleLogout = () => {
    // dispatch per fare il logout
   dispatch(logout()); 
    // Reindirizza l'utente alla pagina di login
    navigate("/login");

    
  };
  
  return (
   	<header className="absolute top-[6%] left-[10%] w-[80%] h-[75px] bg-[#fafafa30] backdrop-blur-sm border border-white/40 rounded-full flex items-center justify-between px-8 py-2 shadow-md">
				{/* Benvenuto */}
				<div className="flex items-center gap-3">
					<div className="flex items-center bg-white/50 border border-white/40 rounded-full px-4 py-1 shadow-sm">
						<img src={userIcon} alt="User" className="w-10 h-9" />
					</div>
					<span className="font-bold text-lg">
						Benvenuto, {user.role}
					</span>
				</div>

				{/* Barra di ricerca */}
				<div className="flex items-center bg-white/70 rounded-full border border-white/60 px-3 py-1 w-[40%] shadow-sm">
					<img src={searchIcon} alt="Cerca" className="w-7 h-5 mr-2" />

					<input
						type="text"
						placeholder="cerca..."
						className="bg-transparent outline-none  font-semibold placeholder-[#1C62A0]/70 w-full"
					/>
				</div>

				{/* Light/Dark mode + Logout */}
				<div className="flex items-center gap-4">
					<div className="flex items-center bg-white/50 border border-white/40 rounded-full px-4 py-1 shadow-sm">
						<img src={sunIcon} alt="Light" className="w-5 h-5 mr-1" />
						<span className=" font-bold text-sm mr-3">Light</span>
						<img src={moonIcon} alt="Dark" className="w-5 h-5 mr-1" />
						<span className=" font-bold text-sm">Dark</span>
					</div>

					<button
						onClick={handleLogout}
						className="bg-white/40 p-2 rounded-full border border-white/60 hover:bg-white/70 transition cursor-pointer"
					>
						<img src={logoutIcon} alt="Logout" className="w-6 h-6" />
					</button>
				</div>
			</header>
  )
}

export default TopBar;