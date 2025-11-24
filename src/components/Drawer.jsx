import { useEffect } from "react";
<<<<<<< HEAD
=======
import { createPortal } from "react-dom";
>>>>>>> feature/core

// open (boolean) → true = mostra la drawer
// onClose (function) → per chiudere la drawer
// title (string) → testo dell’intestazione
// children → contenuto del dettaglio
// width → larghezza (classe tailwind es. "w-[540px]")
const Drawer = ({ open, onClose, title, children, width = "w-[420px]" }) => {
<<<<<<< HEAD
  // useEffect: registra un listener per chiudere con il tasto ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();

    if (open) document.addEventListener("keydown", onKey);

=======
  // ESC per chiudere
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
>>>>>>> feature/core
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

<<<<<<< HEAD
  return (
    <div className="fixed inset-0 z-50">

      {/* Overlay scuro */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer vera */}
      <aside
        className={`absolute right-0 top-0 h-full ${width}
                    bg-[#f4ecff] border-l border-white/40 shadow-2xl
                    transform transition-transform duration-300 translate-x-0
                    overflow-auto`}
        role="dialog"
        aria-modal="true"
      >

        {/* Header lilla chiaro */}
        <header className="sticky top-0 z-10 bg-[#f4ecff]/95 border-b border-white/60 px-6 py-4 flex items-center justify-between">

=======
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
          bg-[#f4ecff] border-l border-white/40 shadow-2xl
          transform transition-transform duration-300 translate-x-0
          overflow-auto
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header lilla chiaro */}
        <header className="sticky top-0 z-10 bg-[#f4ecff]/95 border-b border-white/60 px-6 py-4 flex items-center justify-between">
>>>>>>> feature/core
          <h2 className="text-base font-semibold text-[#090c64]">
            {title}
          </h2>

          {/* Bottone Chiudi */}
          <button
            onClick={onClose}
            className="custom-button"
          >
            Chiudi
          </button>
        </header>

        {/* Contenuto */}
        <div className="p-6 text-[15px] leading-relaxed text-[#090c64]">
          {children}
        </div>
<<<<<<< HEAD

      </aside>
    </div>
  );
=======
      </aside>
    </div>
  );

  // il Drawer viene montato direttamente nel body,
  // anche se si usi dentro la toolbar della tabella
  return createPortal(content, document.body);
>>>>>>> feature/core
};

export default Drawer;
