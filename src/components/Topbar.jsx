import searchIcon from "../assets/icons/search.png";
import userIcon from "../assets/icons/user.png";
import sunIcon from "../assets/icons/sun.png";
import moonIcon from "../assets/icons/do not disturb iOS.png";
import logoutIcon from "../assets/icons/logout.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/feature/authSlice";

const TopBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="topbar">
      {/* Benvenuto */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white/50 border border-white/40 rounded-full px-4 py-1 shadow-sm">
          <img src={userIcon} alt="User" className="w-10 h-9" />
        </div>
        <span className="font-bold text-lg text-primary">
          Benvenuto, {user.role}
        </span>
      </div>

      {/* Barra di ricerca */}
      <div className="flex items-center bg-white/70 rounded-full border border-white/60 px-3 py-1 w-[40%] shadow-sm">
        <img src={searchIcon} alt="Cerca" className="w-7 h-5 mr-2" />
        <input
          type="text"
          placeholder="Cerca..."
          className="bg-transparent outline-none font-semibold placeholder-primary/70 w-full"
        />
      </div>

      {/* Light/Dark mode + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white/50 border border-white/40 rounded-full px-4 py-1 shadow-sm">
          <img src={sunIcon} alt="Light" className="w-5 h-5 mr-1" />
          <span className="font-bold text-sm mr-3 text-primary">
            Light
          </span>
          <img src={moonIcon} alt="Dark" className="w-5 h-5 mr-1" />
          <span className="font-bold text-sm text-primary">
            Dark
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white/40 p-2 rounded-full border border-white/60 hover:bg-white/70 transition cursor-pointer"
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
