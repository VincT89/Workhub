import { useState, useEffect } from "react";

const DrawerAddNewProduct = ({ open, onClose, onAddProduct }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Listener ESC per chiudere il drawer
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAdd = () => {
    if (!code.trim() || !name.trim() || !quantity.trim()) {
      alert("Compila tutti i campi!");
      return;
    }

    const newProduct = {
      id: code.trim(),
      nome: name.trim(),
      stock: { "Mia Sede": parseInt(quantity, 10) },
      categoria: "Non specificata",
      status: "disponibile"
    };

    onAddProduct?.(newProduct);
    // Resetta i campi
    setCode("");
    setName("");
    setQuantity("");
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Sfondo scuro */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <aside
        className="absolute right-0 top-0 w-[420px] h-full
                   bg-[#f4ecff] border-l border-white/40 shadow-2xl
                   overflow-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header className="sticky top-0 bg-[#f4ecff]/90 border-b border-white/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#090c64]">
            Carica giacenza prodotto
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/70 border border-white/50 shadow-sm rounded-lg text-sm text-[#090c64] hover:bg-[#e8defc]"
          >
            Chiudi
          </button>
        </header>

        {/* Contenuto */}
        <div className="p-6 text-[15px] text-[#090c64] flex flex-col gap-4">

          {/* Input Codice */}
          <div>
            <label className="block mb-1 font-semibold">Codice prodotto</label>
            <input
              type="text"
              placeholder="Es. A001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Input Nome */}
          <div>
            <label className="block mb-1 font-semibold">Nome prodotto</label>
            <input
              type="text"
              placeholder="Es. Lampada da tavolo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Input Quantità */}
          <div>
            <label className="block mb-1 font-semibold">Quantità</label>
            <input
              type="number"
              placeholder="Es. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Bottone Aggiungi */}
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-[#d5c7ff]/70 border border-white/70 shadow-sm rounded-lg text-sm text-[#090c64] hover:bg-[#cfc0ff]"
          >
            Aggiungi prodotto
          </button>

        </div>
      </aside>
    </div>
  );
};

export default DrawerAddNewProduct;