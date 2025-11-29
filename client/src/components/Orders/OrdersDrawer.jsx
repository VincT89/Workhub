import { useEffect } from "react";
import bgLight from "../../assets/bg/bg.jpg";

// open (boolean) → true = mostra la drawer
// onClose (function) → per chiudere la drawer
// title (string) → testo dell’intestazione
// children → contenuto del dettaglio
// width → larghezza (classe tailwind es. "w-[540px]")
const OrdersDrawer = ({ open, onClose, title, children, width = "w-[420px]" }) => {
  // ESC per chiudere
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();

    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex justify-end">
      {/* Overlay con sfocatura e tinta viola come il layout */}
      <div
        className="
          absolute inset-0
          bg-linear-to-br from-[#141034]/70 via-[#3c1f7a]/50 to-[#f3e8ff]/40
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`
          relative h-full ${width}
          bg-cover bg-center
          backdrop-blur-2xl
          border-l border-white/70 shadow-2xl
          flex flex-col
        `}
        style={{ backgroundImage: `url(${bgLight})` }}
      >
        {/* Header in stile WorkHub */}
        <header className="sticky top-0 z-10 px-6 py-4 border-b border-white/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#090c64]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="custom-button x-6 py-2 text-sm"
          >
            Chiudi
          </button>
        </header>

        {/* Contenuto */}
        <div className="flex-1 overflow-y-auto p-6 text-[15px] leading-relaxed text-[#090c64]">
          {children}
        </div>
      </aside>
    </div>
  );
};

export default OrdersDrawer;