import { useEffect } from "react";

// open (boolean) → true = mostra la drawer
// onClose (function) → per chiudere la drawer
// title (string) → testo dell’intestazione
// children → contenuto del dettaglio
// width → larghezza (classe tailwind es. "w-[540px]")
const Drawer = ({ open, onClose, title, children, width = "w-[420px]" }) => {
  // useEffect: registra un listener per chiudere con il tasto ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();

    if (open) document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

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

      </aside>
    </div>
  );
};

export default Drawer;