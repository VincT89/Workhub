import { useState, useEffect } from "react";
import bgLight from "../../assets/bg/bg.jpg";

// Drawer per vedere la disponibilità di un prodotto nelle sedi
const DrawerSede = ({ open, onClose, itemsData }) => {
  // itemsData: array di items già presi dal server, ognuno con product, pointOfSales, stock, stockLimit, ecc.

  const [searchCode, setSearchCode] = useState(""); // Codice prodotto da cercare
  const [results, setResults] = useState([]);       // Risultati della ricerca

  // Chiude il drawer premendo ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Funzione di ricerca
  const searchStores = () => {
    if (!searchCode.trim()) return;

    // Filtra gli items per il prodotto selezionato
    const filtered = itemsData.filter(
      (item) => item.product?.sku.toLowerCase() === searchCode.toLowerCase()
    );

    if (filtered.length === 0) {
      setResults([{ error: "Prodotto non trovato" }]);
      return;
    }

    // Ordina per stock decrescente (opzionale)
    filtered.sort((a, b) => b.stock - a.stock);

    setResults(filtered);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside
        className="absolute right-0 top-0 w-[420px] h-full border-l border-white/40 shadow-2xl overflow-auto bg-cover bg-center"
        role="dialog"
        aria-modal="true"
        style={{ backgroundImage: `url(${bgLight})` }}
      >
        {/* HEADER */}
        <header className="sticky top-0 border-b border-white/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#090c64]">
            Disponibilità in altre sedi
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/70 shadow-sm rounded-xl text-sm bg-[#090c64] text-white cursor-pointer"
          >
            Chiudi
          </button>
        </header>

        {/* CONTENUTO */}
        <div className="p-6 text-[15px] text-[#090c64]">
          <label className="block mb-2 font-semibold">Codice prodotto</label>
          <input
            type="text"
            placeholder="Es. A001"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-xl"
          />

          <button
            onClick={searchStores}
            className="px-4 py-2 border border-white/70 shadow-sm rounded-xl text-sm text-white bg-[#090c64] mb-6 cursor-pointer"
          >
            Cerca disponibilità
          </button>

          <div>
            {results.length === 0 && <p className="opacity-70">Nessuna ricerca effettuata.</p>}

            {results.map((item, i) => {
              if (item.error)
                return (
                  <p key={i} className="text-red-600">
                    {item.error}
                  </p>
                );

              return (
                <div
                  key={i}
                  className="py-2 border-b border-white/40 flex flex-col gap-1"
                >
                  <span><strong>Sede:</strong> {item.pointOfSales?.name}</span>
                  <span><strong>Stock:</strong> {item.stock} pezzi</span>
                  <span><strong>Stock limite:</strong> {item.stockLimit}</span>
                  {item.promo?.isActive && (
                    <span>
                      <strong>Promo:</strong> {item.promo.value} {item.promo.mode === "percentage" ? "%" : "€"}
                    </span>
                  )}
                  {item.note && <span><strong>Note:</strong> {item.note}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DrawerSede;