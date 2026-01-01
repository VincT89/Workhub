// Import principali
import { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux"; 
import { updateItemQuantity } from "../../store/feature/itemsSlice"; 
import { useTheme } from "../../context/ThemeContext"; 
import { useLanguage } from "../../context/LanguageContext"; 
import bgLight from "../../assets/bg/bg.jpg"; 
import bgDark from "../../assets/bg/bgScuro.jpg"; 

const DrawerAddNewProduct = ({ open, onClose }) => {
  const dispatch = useDispatch(); 
  const items = useSelector(state => state.items.list); 

  const [search, setSearch] = useState(""); 
  const [results, setResults] = useState([]); 
  const [quantity, setQuantity] = useState(1); 

  const { theme } = useTheme(); 
  const { t } = useLanguage(); 
  
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.(); 
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset della ricerca e quantità quando il drawer si chiude
useEffect(() => {
  if (!open) {
    setSearch("");
    setResults([]);
    setQuantity(1);
  }
}, [open]);


  const searchItems = () => {
    if (!search.trim()) return;

    const filtered = items.filter(
      (item) =>
        item.product?.name.toLowerCase().includes(search.toLowerCase()) ||
        item.product?.sku.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
      setResults([{ error: "Prodotto non trovato" }]);
      return;
    }

    filtered.sort((a, b) => b.stock - a.stock);
    setResults(filtered);
  };

  const handleAddStock = async (itemId) => {
    if (!quantity || quantity === 0) return alert(t("inserisciQuantitaValida"));
    try {
      const resultAction = await dispatch(updateItemQuantity({ id: itemId, quantityToAdd: Number(quantity) }));
      if (updateItemQuantity.fulfilled.match(resultAction)) {
        alert(`${t("stockAggiornato")} ${resultAction.payload.stock}`);
        setQuantity(1);
        setSearch("");
        setResults([]);
        onClose();
      } else {
        const err = resultAction.payload || resultAction.error?.message;
        alert(t("errore") + " " + err);
      }
    } catch (err) {
      console.error(err);
      alert(t("erroreImprevisto"));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 w-[420px] h-full border-l border-white/40 shadow-2xl overflow-auto bg-cover bg-center"
        role="dialog"
        aria-modal="true"
        style={{ backgroundImage: `url(${theme === "dark" ? bgDark : bgLight})` }}
      >
        <header className="sticky top-0 border-b border-white/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{t("aggiungiStock")}</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/70 shadow-sm rounded-xl text-sm custom-button cursor-pointer"
          >
            {t("chiudi")}
          </button>
        </header>

        <div className="p-6 text-[15px]">
          <label className="block mb-2 font-semibold">{t("nomeProdottoSku")}</label>
          <input
            type="text"
            placeholder="Es. BILLY Libreria o SKU1234"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-xl"
          />

          <label className="block mb-2 font-semibold">{t("quantitaDaAggiungere")}</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-xl"
            min={1}
          />

          <button
            onClick={searchItems}
            className="px-4 py-2 border border-white/70 shadow-sm rounded-xl text-sm custom-button mb-6 cursor-pointer"
          >
            {t("cercaProdotto")}
          </button>

          {/* RISULTATI */}
          <div className="flex flex-col gap-4">
            {results.length === 0 && (
              <p className="opacity-70">{t("nessunaRicercaEffettuata")}</p>
            )}

            {results.map((item, i) => {
              if (item.error)
                return (
                  <p key={i} className="text-red-600">{item.error}</p>
                );

              return (
                <div
                  key={i}
                  className="w-full rounded-2xl bg-[rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-lg p-4 shadow-sm text-sm md:text-base flex flex-col gap-1"
                >
                  <span><strong>{t("prodotto")}:</strong> {item.product?.name}</span>
                  <span><strong>SKU:</strong> {item.product?.sku}</span>
                  <span><strong>{t("point")}:</strong> {item.pointOfSales?.name}</span>
                  <span><strong>{t("stock")}:</strong> {item.stock}</span>

                  <button
                    onClick={() => handleAddStock(item._id)}
                    className="mt-2 px-3 py-1 border border-white/70 shadow-sm rounded-xl text-sm text-white bg-[#090c64] hover:bg-[#0a0f85]"
                  >
                    {t("aggiungi")} {quantity} {t("pezzi")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DrawerAddNewProduct;