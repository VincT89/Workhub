import { useNavigate } from "react-router-dom";

import addIcon from "../assets/icons/add.png";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";
import settingsIcon from "../assets/icons/settings.png";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
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
  );
};

export default Sidebar;
