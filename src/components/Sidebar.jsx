import { useNavigate } from "react-router-dom";

import addIcon from "../assets/icons/add.png";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";
import settingsIcon from "../assets/icons/settings.png";

const Sidebar = () => {
  const navigate = useNavigate();


  return (
    <>
      <aside className="absolute top-1/2 left-[5%] h-[40%] -translate-y-1/2 flex flex-col items-center justify-evenly gap-5 bg-[#fafafa20] backdrop-blur-sm rounded-[50px] border border-white/30 p-4 shadow-md">
        {/* ADD */}
        <img
          src={addIcon}
          alt="Aggiungi"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition"
        />

        {/* EDIT */}
        <img
          src={editIcon}
          alt="Modifica"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition"
        />

        {/* DELETE */}
        <img
          src={deleteIcon}
          alt="Elimina"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition"
        />

        {/* SETTINGS */}
        <img
          src={settingsIcon}
          alt="Impostazioni"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/settings")}
        />
      </aside>
    </>
  );
};

export default Sidebar;
