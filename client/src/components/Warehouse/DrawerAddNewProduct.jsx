import { useState, useEffect } from "react";
import bgLight from "../../assets/bg/bg.jpg";

const DrawerAddNewProduct = ({ open, onClose, onAddProduct }) => {
  const [productId, setProductId] = useState("");
  const [pointOfSalesId, setPointOfSalesId] = useState("");
  const [stock, setStock] = useState("");
  const [stockLimit, setStockLimit] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAdd = () => {
    if (!productId || !pointOfSalesId || !stock || !stockLimit) {
      alert("Compila tutti i campi obbligatori!");
      return;
    }

    const newItem = {
      product: productId,
      pointOfSales: pointOfSalesId,
      stock: parseInt(stock, 10),
      stockLimit: parseInt(stockLimit, 10),
      note: note || ""
    };

    onAddProduct?.(newItem);

    setProductId("");
    setPointOfSalesId("");
    setStock("");
    setStockLimit("");
    setNote("");
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <aside
        className="w-full max-w-md h-full bg-white shadow-xl overflow-y-auto"
        aria-modal="true"
        style={{ backgroundImage: `url(${bgLight})` }}
      >
        <header className="sticky top-0 border-b border-white/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#090c64]">
            Carica giacenza prodotto
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#090c64] border border-white/50 shadow-sm rounded-xl text-sm text-white cursor-pointer"
          >
            Chiudi
          </button>
        </header>

        <div className="p-6 text-[15px] text-[#090c64] flex flex-col gap-4">
          {/* Product ID */}
          <div>
            <label className="block mb-1 font-semibold">
              ID Prodotto
            </label>
            <input
              type="text"
              placeholder="Es. 65f2c1a..."
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          {/* Point of Sales */}
          <div>
            <label className="block mb-1 font-semibold">
              ID Punto Vendita
            </label>
            <input
              type="text"
              placeholder="Es. 65f2c1a..."
              value={pointOfSalesId}
              onChange={(e) => setPointOfSalesId(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-semibold">QuantitÃ </label>
            <input
              type="number"
              placeholder="Es. 10"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          {/* Stock Limit */}
          <div>
            <label className="block mb-1 font-semibold">Soglia minima</label>
            <input
              type="number"
              placeholder="Es. 5"
              value={stockLimit}
              onChange={(e) => setStockLimit(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block mb-1 font-semibold">Note (opzionale)</label>
            <textarea
              placeholder="Aggiungi note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-[#090c64] border border-white/70 shadow-sm rounded-xl text-sm text-white cursor-pointer"
          >
            Aggiungi prodotto
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DrawerAddNewProduct;