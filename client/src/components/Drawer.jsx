import { useEffect } from "react";
import { createPortal } from "react-dom";

import bgLight from "../assets/bg/bg.jpg";
import bgDark from "../assets/bg/bgScuro.jpg";


import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// open (boolean) → true = mostra la drawer
// onClose (function) → per chiudere la drawer
// title (string) → testo dell’intestazione
// children → contenuto del dettaglio
// width → larghezza (classe tailwind es. "w-[540px]")
const Drawer = ({ open, onClose, title, children, width = "w-[420px]" }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  // ESC per chiudere
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-9999">

      {/* Overlay scuro */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer vera */}
      <aside
        className={`
          absolute right-0 top-0 h-full ${width}
          border-l border-white/40 shadow-2xl
          transform transition-transform duration-300 translate-x-0
          overflow-auto bg-cover bg-center
        `}
        style={{
          backgroundImage: `url(${theme === "dark" ? bgDark : bgLight})`
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header lilla chiaro */}
        <header className="sticky top-0 z-10 border-b border-white/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold ">
            {title}
          </h2>

          {/* Bottone Chiudi */}
          <button
            onClick={onClose}
            className="custom-button"
          >
            {t("chiudi")}
          </button>
        </header>

        {/* Contenuto */}
        <div className="p-6 text-[15px] leading-relaxed ">
          {children}
        </div>
      </aside>
    </div>
  );

  // il Drawer viene montato direttamente nel body,
  // anche se si usi dentro la toolbar della tabella
  return createPortal(content, document.body);
};

export default Drawer;
